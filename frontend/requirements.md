# Sasya AI Multimodal Agricultural Dataset - Requirements

## 1. Overview

Sasya AI is a comprehensive multimodal agricultural dataset designed for Indian agriculture, combining market data, speech data in 9 Indian languages, text-based Q&A, and computer vision datasets for crop classification and disease detection. The dataset aims to support AI/ML applications for agricultural decision-making, farmer assistance, and crop management.

## 2. User Stories

### 2.1 Data Scientist / ML Researcher
As a data scientist, I want to access structured agricultural market data so that I can build predictive models for crop pricing and market trends.

### 2.2 Agricultural AI Developer
As an AI developer, I want multilingual speech datasets so that I can create voice-based agricultural advisory systems for farmers in their native languages.

### 2.3 Computer Vision Engineer
As a CV engineer, I want labeled crop and disease images so that I can train models for automated crop identification and disease diagnosis.

### 2.4 Agricultural Economist
As an economist, I want historical price and weather data so that I can analyze correlations between climate patterns and market dynamics.

### 2.5 NLP Researcher
As an NLP researcher, I want domain-specific agricultural Q&A data so that I can fine-tune language models for agricultural advisory chatbots.

## 3. Functional Requirements

### 3.1 Market Data Module

#### 3.1.1 Price Data Management
- **FR-3.1.1.1**: System shall provide historical commodity prices from AgMarkNet covering 32 crops across 13 states from 2019-2024
- **FR-3.1.1.2**: System shall include 29,536 price records with temporal granularity
- **FR-3.1.1.3**: System shall support querying by crop, state, district, and date range

#### 3.1.2 Weather Data Integration
- **FR-3.1.2.1**: System shall provide daily weather data for 13 agricultural districts
- **FR-3.1.2.2**: System shall include temperature, humidity, rainfall, wind speed, and pressure parameters
- **FR-3.1.2.3**: System shall contain 27,313 weather records spanning 2019-2024

#### 3.1.3 eNAM Transaction Data
- **FR-3.1.3.1**: System shall provide electronic market transaction records from 2022-2024
- **FR-3.1.3.2**: System shall support analysis of digital agricultural trading patterns

#### 3.1.4 Policy and Scheme Information
- **FR-3.1.4.1**: System shall include structured data on major agricultural schemes (PM-KISAN, PMFBY, Soil Health Card, eNAM, PKVY)
- **FR-3.1.4.2**: System shall provide scheme details including eligibility, benefits, and launch years

### 3.2 Speech Data Module

#### 3.2.1 Multilingual Coverage
- **FR-3.2.1.1**: System shall provide speech datasets in 9 Indian languages: Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Odia, Tamil, Telugu
- **FR-3.2.1.2**: System shall include both male and female voice samples where applicable
- **FR-3.2.1.3**: System shall provide line index files mapping audio files to transcriptions

#### 3.2.2 Audio Quality Standards
- **FR-3.2.2.1**: System shall provide audio files in WAV format
- **FR-3.2.2.2**: System shall maintain consistent audio quality suitable for ASR training
- **FR-3.2.2.3**: System shall include metadata for speaker demographics where available

### 3.3 Text Q&A Module

#### 3.3.1 Question-Answer Pairs
- **FR-3.3.1.1**: System shall provide comprehensive agricultural Q&A covering disease/pest control, fertilizer/nutrition, livestock, crop varieties, and farming practices
- **FR-3.3.1.2**: System shall structure Q&A in conversational format with user-assistant message pairs
- **FR-3.3.1.3**: System shall categorize questions by agricultural domain
- **FR-3.3.1.4**: System shall provide unique identifiers for each Q&A pair

#### 3.3.2 Data Formats
- **FR-3.3.2.1**: System shall provide Q&A data in both JSON and CSV formats
- **FR-3.3.2.2**: System shall support multiple dataset sizes (standard, comprehensive, massive)

### 3.4 Vision Data Module

#### 3.4.1 Crop Classification Dataset
- **FR-3.4.1.1**: System shall provide labeled images for 90+ crop types
- **FR-3.4.1.2**: System shall organize images by crop category in separate directories
- **FR-3.4.1.3**: System shall include crops relevant to Indian agriculture (rice, wheat, cotton, spices, fruits, vegetables)
- **FR-3.4.1.4**: System shall provide dataset summary with extraction reports

#### 3.4.2 Disease Detection Dataset
- **FR-3.4.2.1**: System shall provide labeled disease images for 27 major crops
- **FR-3.4.2.2**: System shall include multiple disease classes per crop
- **FR-3.4.2.3**: System shall organize images by crop and disease type
- **FR-3.4.2.4**: System shall cover diseases for staple crops (rice, wheat, corn, potato, tomato) and cash crops (cotton, sugarcane, coffee, tea)

## 4. Non-Functional Requirements

### 4.1 Data Quality
- **NFR-4.1.1**: All datasets shall maintain >95% accuracy in labeling
- **NFR-4.1.2**: Missing data shall be documented and flagged
- **NFR-4.1.3**: Data shall be validated against authoritative sources

### 4.2 Accessibility
- **NFR-4.2.1**: Dataset structure shall be intuitive and well-documented
- **NFR-4.2.2**: File formats shall be standard and widely supported
- **NFR-4.2.3**: Dataset shall include comprehensive README and metadata files

### 4.3 Scalability
- **NFR-4.3.1**: Dataset structure shall support incremental updates
- **NFR-4.3.2**: File organization shall handle growing data volumes efficiently
- **NFR-4.3.3**: Total dataset size shall be optimized for storage and transfer

### 4.4 Interoperability
- **NFR-4.4.1**: Data formats shall be compatible with popular ML frameworks (PyTorch, TensorFlow, scikit-learn)
- **NFR-4.4.2**: Metadata shall follow standard schemas where applicable
- **NFR-4.4.3**: Dataset shall support integration with agricultural APIs and databases

### 4.5 Documentation
- **NFR-4.5.1**: Each module shall include summary statistics
- **NFR-4.5.2**: Data collection methodology shall be documented
- **NFR-4.5.3**: Usage examples shall be provided for each data type

## 5. Data Coverage Summary

### 5.1 Temporal Coverage
- Market data: 2019-2024 (6 years)
- Weather data: 2019-2024 (6 years)
- eNAM transactions: 2022-2024 (3 years)

### 5.2 Geographic Coverage
- 13 states
- 50 districts
- Focus on major agricultural regions of India

### 5.3 Crop Coverage
- 32 crops in market data
- 90+ crops in vision classification
- 27 crops in disease detection

### 5.4 Language Coverage
- 9 Indian languages for speech data
- English for text Q&A (with Indian agricultural context)

## 6. Acceptance Criteria

### 6.1 Market Data
- **AC-6.1.1**: All 70,774 market records are accessible and properly formatted
- **AC-6.1.2**: Weather data correlates temporally with price data
- **AC-6.1.3**: Policy scheme data is complete with all required fields

### 6.2 Speech Data
- **AC-6.2.1**: All 9 language datasets are present with audio files and transcriptions
- **AC-6.2.2**: Line index files correctly map to audio files
- **AC-6.2.3**: Audio files are playable and of acceptable quality

### 6.3 Text Q&A
- **AC-6.3.1**: Q&A pairs cover all major agricultural categories
- **AC-6.3.2**: Answers are contextually relevant to Indian agriculture
- **AC-6.3.3**: Data is available in both JSON and CSV formats

### 6.4 Vision Data
- **AC-6.4.1**: Crop classification covers 90+ crop types with sufficient samples per class
- **AC-6.4.2**: Disease detection includes multiple disease states per crop
- **AC-6.4.3**: Images are properly labeled and organized by category

### 6.5 Overall Dataset
- **AC-6.5.1**: Total dataset size is approximately 5GB for market data plus additional storage for speech and vision
- **AC-6.5.2**: All summary JSON files are present and accurate
- **AC-6.5.3**: Directory structure is consistent and well-organized

## 7. Constraints

### 7.1 Technical Constraints
- Dataset must be compatible with Windows, Linux, and macOS file systems
- File naming conventions must avoid special characters
- Large files should be split appropriately for version control

### 7.2 Data Constraints
- Historical data limited to available public sources
- Speech data quality depends on original recording conditions
- Image datasets limited to available labeled agricultural images

### 7.3 Legal and Ethical Constraints
- Data must comply with Indian data protection regulations
- Proper attribution must be maintained for source datasets
- Privacy considerations for any farmer-specific data

## 8. Dependencies

### 8.1 External Data Sources
- AgMarkNet for commodity prices
- IMD (India Meteorological Department) for weather data
- eNAM platform for transaction data
- Public agricultural image repositories
- Speech corpus from Indian language datasets

### 8.2 Tools and Libraries
- Python for data processing
- Pandas for tabular data manipulation
- Librosa/torchaudio for audio processing
- PIL/OpenCV for image processing
- JSON/CSV parsers for structured data

## 9. Success Metrics

### 9.1 Completeness
- 100% of planned data modules are present
- All summary files accurately reflect dataset contents

### 9.2 Usability
- Researchers can load and use data within 30 minutes of download
- Clear documentation enables self-service data exploration

### 9.3 Quality
- <1% error rate in data labeling
- No corrupted files in the dataset
- Consistent formatting across all data files

### 9.4 Impact
- Dataset enables development of at least 3 types of agricultural AI applications (price prediction, speech recognition, crop/disease classification)
- Dataset is cited in agricultural AI research papers
- Farmers benefit from AI tools built using this dataset
