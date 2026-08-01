import { NextResponse } from 'next/server';
import twilio from 'twilio';

const MessagingResponse = twilio.twiml.MessagingResponse;

type UserState = {
  step: 'LANGUAGE' | 'MAIN_MENU' | 'CHAT' | 'DISEASE';
  language: string;
};

// Global state map (persists in dev)
const globalForState = global as unknown as { userStates: Map<string, UserState> };
const userStates = globalForState.userStates || new Map<string, UserState>();
if (process.env.NODE_ENV !== 'production') globalForState.userStates = userStates;

const LANGUAGE_MENU = `Welcome to Sasya AI! 🌱
Please choose your preferred language by replying with a number:
1. English 🇬🇧
2. हिन्दी (Hindi) 🇮🇳
3. ગુજરાતી (Gujarati) 🇮🇳
4. मराठी (Marathi) 🇮🇳
5. தமிழ் (Tamil) 🇮🇳
6. తెలుగు (Telugu) 🇮🇳
7. ਪੰਜਾਬੀ (Punjabi) 🇮🇳
8. ಕನ್ನಡ (Kannada) 🇮🇳
9. বাংলা (Bengali) 🇮🇳
10. ଓଡ଼ିଆ (Odia) 🇮🇳`;

const MAIN_MENU = `Please choose a service by replying with a number:
1. Chat Assistant 💬
2. Crop Disease Diagnosis 🌿

(Type *menu* at any time to return here)`;

// Background function to process the request and send the reply
async function processAndReply(params: URLSearchParams, from: string, to: string, state: UserState) {
  const body = params.get('Body') || '';
  const numMedia = parseInt(params.get('NumMedia') || '0', 10);
  const mediaUrl = params.get('MediaUrl0');
  
  let responseText = '';
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://neel2601-sasya-ai-backend.hf.space';

  try {
    if (state.step === 'DISEASE') {
      if (numMedia > 0 && mediaUrl) {
        // 1. Process Image
      // Twilio WhatsApp media URLs are protected! We must use Basic Auth to download the image.
      const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
      const authToken = process.env.TWILIO_AUTH_TOKEN || '';
      const authHeader = 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64');

      const imageResponse = await fetch(mediaUrl, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      const imageBlob = await imageResponse.blob();
      
      const hfFormData = new FormData();
      hfFormData.append('image_file', imageBlob, 'image.jpg'); // Fix: Backend expects 'image_file'
      hfFormData.append('language', state.language);
      
      // If the user sent text with the image, pass it to the backend!
      if (body.trim() !== '') {
        hfFormData.append('message', body);
        hfFormData.append('explain', 'true');
      }
      
      const hfResponse = await fetch(`${backendUrl}/image-diagnosis`, {
        method: 'POST',
        body: hfFormData,
      });

      if (hfResponse.ok) {
        const data = await hfResponse.json();
        
        // Backend returns confidence as a percentage (e.g. 35.84) or a decimal (0.3584). 
        // We'll safely format it to always display correctly.
        const confidenceNum = parseFloat(data.confidence);
        const confidenceStr = confidenceNum > 1 ? confidenceNum.toFixed(2) : (confidenceNum * 100).toFixed(2);
        
        let msg = `*Disease Detected:* ${data.display_name || data.disease}\n*Confidence:* ${confidenceStr}%\n`;
        
        if (data.cause) {
          msg += `\n*Cause:*\n${data.cause}\n`;
        }
        
        if (data.treatment && Array.isArray(data.treatment) && data.treatment.length > 0) {
          msg += `\n*Treatment:*\n- ${data.treatment.join('\n- ')}\n`;
        }
        
        if (data.prevention) {
          msg += `\n*Prevention:*\n${data.prevention}\n`;
        }
        
        if (data.advisory) {
          msg += `\n*AI Advice:*\n${data.advisory}`;
        }
        
        responseText = msg.trim();
      } else {
        responseText = "Sorry, I couldn't analyze the image. Please try again.";
      }
      } else {
        responseText = "Please send a clear photo of the affected crop for diagnosis. 📸\n\n(Type *menu* to go back to the main menu)";
      }
    } else if (state.step === 'CHAT') {
      if (numMedia > 0) {
        responseText = "I received an image, but I'm currently in Chat mode.\nType *menu* and choose 'Crop Disease Diagnosis' to analyze images. 🌿";
      } else {
        // 2. Process Text
        const chatParams = new URLSearchParams();
        chatParams.append('message', body);
        chatParams.append('lang', state.language);
      chatParams.append('channel', 'whatsapp');

      const hfResponse = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: chatParams,
      });

      if (hfResponse.ok) {
        const data = await hfResponse.json();
        responseText = data.response;
      } else {
        responseText = "Sorry, I couldn't reach the AI at the moment. Please try again later.";
      }
      }
    }
  } catch (error) {
    console.error("Error processing AI request:", error);
    responseText = "An unexpected error occurred while processing your request.";
  }

  // Send the actual message back using Twilio REST API
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.error("Missing Twilio credentials! Cannot send async message.");
      return;
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: responseText,
      from: to,   // The Sandbox number
      to: from    // The farmer's phone number
    });
  } catch (err) {
    console.error("Failed to send message via Twilio API:", err);
  }
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    const from = params.get('From') || '';
    const to = params.get('To') || '';
    const body = (params.get('Body') || '').trim().toLowerCase();
    const numMedia = parseInt(params.get('NumMedia') || '0', 10);
    
    let state = userStates.get(from);
    const twiml = new MessagingResponse();

    // Reset conditions
    if (!state || ['hi', 'hello', 'menu', 'reset', 'start'].includes(body)) {
      userStates.set(from, { step: 'LANGUAGE', language: 'en' });
      twiml.message(LANGUAGE_MENU);
      return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
    }

    if (state.step === 'LANGUAGE') {
      const langMap: Record<string, string> = {
        '1': 'en', '2': 'hi', '3': 'gu', '4': 'mr', '5': 'ta', '6': 'te', '7': 'pa', '8': 'kn', '9': 'bn', '10': 'or'
      };
      if (langMap[body]) {
        state.language = langMap[body];
        state.step = 'MAIN_MENU';
        userStates.set(from, state);
        twiml.message(MAIN_MENU);
      } else {
        twiml.message(`Invalid choice.\n\n${LANGUAGE_MENU}`);
      }
      return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
    }

    if (state.step === 'MAIN_MENU') {
      if (body === '1') {
        state.step = 'CHAT';
        userStates.set(from, state);
        twiml.message("You are now connected to the Chat Assistant. Send me your agriculture-related questions! 🌾\n\n(Type *menu* to go back)");
      } else if (body === '2') {
        state.step = 'DISEASE';
        userStates.set(from, state);
        twiml.message("You are now in Crop Disease Diagnosis mode. Please send a clear photo of the affected crop. 📸\n\n(Type *menu* to go back)");
      } else {
        twiml.message(`Invalid choice.\n\n${MAIN_MENU}`);
      }
      return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
    }

    // Fire the AI processing in the background without waiting
    processAndReply(params, from, to, state).catch(console.error);

    // IMMEDIATELY return a humanized holding message so the user gets instant feedback
    if (numMedia > 0) {
      twiml.message("Let me take a close look at this picture... give me just a few seconds! 🔍🌱");
    } else {
      twiml.message("Let me think about that for a second, checking my notes... 🌾");
    }
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
