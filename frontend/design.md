# Sasya AI Multimodal Agricultural Dataset - Design Document

## 1. System Architecture

### 1.1 Overview
The Sasya AI dataset follows a modular architecture with four primary data domains: Market, Speech, Text Q&A, and Vision. Each module is self-contained with its own directory structure, metadata, and data formats optimized for specific ML tasks.

### 1.2 High-Level Architecture

```
Sasya AI Data/
├── market/          # Structured tabular data (CSV, JSON)
├── speech/          # Audio files + transcriptions (WAV, TSV)
├── text_qa/         # Question-answer pairs (JSON, CSV)
└── vision/          # Image datasets (JPG, PNG)
```

### 1.3 Design Principles
- **Modularity**: Each data type is independent and can be used separately
- **Standardization**: Consistent file formats and naming conventions
- **Scalability**: Structure supports adding new data without reorganization
- **Accessibility**: Simple directory hierarchy for easy navigation
- **Metadata-driven**: Summary files provide quick dataset overview

## 2. Data Module Designs

### 2.1 Market Data Module

#### 2.1.1 Directory Structure
```
market/
├── complete_market_data_summary.json
├── agmarknet/
│   ├── dataset_summary.json
│   └── historical_prices_2019_2024.csv
├── enam/
│   └── enam_transactions_2022_2024.csv
├── imd_weather/
│   ├── weather_summary.json
│   └── daily_weather_2019_2024.csv
├── icrisat_district/
│   └── district_crop_data.csv
└── policy_reports/
    └── agricultural_schemes.json
```

#### 2.1.2 Data Schema

**AgMarkNet Prices (CSV)**
```
Columns: date, state, district, market, commodity, variety, grade, 
         min_price, max_price, modal_price, arrivals
Data Types: date (YYYY-MM-DD), string, string, string, string, string, 
            string, float, float, float, integer
```

**Weather Data (CSV)**
```
Columns: date, district, state, temperature_max, temperature_min, 
         humidity, rainfall, wind_speed, pressure
Data Types: date (YYYY-MM-DD), string, string, float, float, 
            float, float, float, float
```

**eNAM Transactions (CSV)**
```
Columns: transaction_date, state, market, commodity, quantity_quintal, 
         price_per_quintal, total_value
Data Types: date, string, string, string, float, float, float
```

**Agricultural Schemes (JSON)**
```json
{
  "scheme_name": "string",
  "description": "string",
  "beneficiary_amount": number,
  "frequency": "string",
  "eligibility": "string",
  "launch_year": number
}
```

#### 2.1.3 Data Processing Pipeline
1. **Ingestion**: Load raw data from government APIs/portals
2. **Cleaning**: Handle missing values, standardize formats
3. **Validation**: Check data ranges, consistency
4. **Aggregation**: Generate summary statistics
5. **Export**: Save to CSV/JSON with metadata

### 2.2 Speech Data Module

#### 2.2.1 Directory Structure
```
speech/
├── Bengali/
│   ├── line_index.tsv
│   └── wavs/
│       └── *.wav (1367 files)
├── Gujarati/
│   ├── line_index_female.tsv
│   ├── line_index_male.tsv
│   ├── Female/
│   │   └── *.wav (2221 files)
│   └── Male/
│       └── *.wav
├── Hindi/
│   └── GV_Train_100h/
├── [Kannada, Malayalam, Marathi, Odia, Tamil, Telugu]/
    └── Similar structure
```

#### 2.2.2 Line Index Format (TSV)
```
Columns: audio_filename, speaker_id, transcription, duration_seconds
Example: bin_0834_0030520634.wav | speaker_001 | [transcription text] | 3.45
```

#### 2.2.3 Audio Specifications
- **Format**: WAV (uncompressed)
- **Sample Rate**: 16kHz or 22kHz (standard for ASR)
- **Bit Depth**: 16-bit
- **Channels**: Mono
- **Duration**: Variable (typically 2-10 seconds per utterance)

#### 2.2.4 Language Coverage Strategy
- **High-resource languages**: Hindi (100+ hours)
- **Medium-resource**: Gujarati, Bengali, Tamil, Telugu
- **Gender balance**: Male and female speakers where possible
- **Domain**: Agricultural terminology and common phrases

### 2.3 Text Q&A Module

#### 2.3.1 Directory Structure
```
text_qa/
├── indian_agricultural_qa.json
├── comprehensive_indian_agricultural_qa.json
└── massive_indian_agricultural_qa.json
└── massive_indian_agricultural_qa.csv
```

#### 2.3.2 Q&A Data Schema (JSON)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Question text"
    },
    {
      "role": "assistant",
      "content": "Answer text with specific agricultural advice"
    }
  ],
  "category": "disease_pest_control | fertilizer_nutrition | livestock | crop_varieties | farming_practices",
  "id": "unique_identifier"
}
```

#### 2.3.3 Category Distribution
- **Disease & Pest Control**: 30%
- **Fertilizer & Nutrition**: 25%
- **Crop Varieties & Selection**: 20%
- **Livestock Management**: 15%
- **General Farming Practices**: 10%

#### 2.3.4 Answer Quality Guidelines
- Specific to Indian agricultural context
- Include quantitative recommendations (dosages, timings)
- Reference local crop varieties and practices
- Provide actionable advice
- Use simple, farmer-friendly language

### 2.4 Vision Data Module

#### 2.4.1 Directory Structure
```
vision/
├── Crop Classification/
│   ├── dataset_summary.json
│   ├── extraction_report.json
│   ├── aji_pepper/
│   ├── almonds/
│   ├── [90+ crop directories]/
│   └── wheat/
└── Disease Detection/
    ├── Apple/
    │   ├── Apple_scab/
    │   ├── Black_rot/
    │   ├── Cedar_apple_rust/
    │   └── Healthy/
    ├── [27 crop directories]/
    └── Wheat/
        ├── Brown_rust/
        ├── Yellow_rust/
        └── Healthy/
```

#### 2.4.2 Image Specifications
- **Format**: JPEG or PNG
- **Resolution**: Minimum 224x224 pixels (suitable for CNNs)
- **Color Space**: RGB
- **File Size**: Optimized for storage (<500KB per image)

#### 2.4.3 Crop Classification Design
- **Classes**: 90+ crop types
- **Images per class**: Variable (minimum 50, target 200+)
- **Image sources**: Field photos, agricultural databases
- **Augmentation**: Original images only (augmentation left to user)

#### 2.4.4 Disease Detection Design
- **Crops covered**: 27 major crops
- **Disease classes per crop**: 2-5 diseases + healthy class
- **Total classes**: 100+ disease categories
- **Labeling**: Crop_Disease format (e.g., "Tomato_Early_Blight")
- **Balanced dataset**: Attempt to balance healthy vs diseased samples

## 3. Data Integration and Relationships

### 3.1 Cross-Module Linkages

#### 3.1.1 Market-Weather Correlation
- **Link**: Date + District
- **Use Case**: Analyze weather impact on crop prices
- **Implementation**: Join on date and district fields

#### 3.1.2 Text Q&A - Vision Integration
- **Link**: Crop/disease names
- **Use Case**: Multimodal agricultural assistant (text + image)
- **Implementation**: Named entity matching

#### 3.1.3 Speech - Text Q&A Integration
- **Link**: Content domain
- **Use Case**: Voice-based agricultural advisory
- **Implementation**: ASR → Q&A retrieval pipeline

### 3.2 Temporal Alignment
- Market and weather data: Daily granularity, 2019-2024
- eNAM transactions: Transaction-level, 2022-2024
- Speech/Vision/Text: Timeless (not temporally bound)

## 4. Data Quality and Validation

### 4.1 Quality Assurance Process

#### 4.1.1 Market Data Validation
- Price range checks (min < modal < max)
- Date continuity verification
- State/district name standardization
- Outlier detection for prices and arrivals

#### 4.1.2 Speech Data Validation
- Audio file integrity checks
- Transcription-audio alignment verification
- Duration consistency checks
- Speaker ID validation

#### 4.1.3 Text Q&A Validation
- Answer relevance scoring
- Factual accuracy verification
- Category assignment validation
- Duplicate detection

#### 4.1.4 Vision Data Validation
- Image corruption checks
- Label consistency verification
- Class distribution analysis
- Resolution and format validation

### 4.2 Metadata Standards

#### 4.2.1 Summary JSON Structure
```json
{
  "total_records": number,
  "date_range": "YYYY-MM-DD to YYYY-MM-DD",
  "coverage": {
    "states": number,
    "districts": number,
    "crops": number
  },
  "file_size_mb": number,
  "last_updated": "YYYY-MM-DD",
  "version": "string"
}
```

## 5. Storage and File Management

### 5.1 File Naming Conventions

#### 5.1.1 Market Data
- Pattern: `{source}_{data_type}_{start_year}_{end_year}.csv`
- Example: `historical_prices_2019_2024.csv`

#### 5.1.2 Speech Data
- Pattern: `{language_code}_{speaker_id}_{utterance_id}.wav`
- Example: `guf_01063_00076624578.wav`

#### 5.1.3 Vision Data
- Pattern: `{crop}_{disease}_{image_id}.jpg`
- Example: `tomato_early_blight_001.jpg`

### 5.2 Storage Optimization
- CSV for tabular data (efficient, human-readable)
- JSON for structured metadata and Q&A
- WAV for audio (uncompressed for quality)
- JPEG for images (compressed for storage)

### 5.3 Version Control Strategy
- Large binary files: Use Git LFS or external storage
- Text files: Standard Git versioning
- Metadata: Track changes in version field
- Changelog: Document dataset updates

## 6. API and Access Patterns

### 6.1 Data Loading Patterns

#### 6.1.1 Python Data Loaders
```python
# Market data
import pandas as pd
prices = pd.read_csv('market/agmarknet/historical_prices_2019_2024.csv')

# Text Q&A
import json
with open('text_qa/indian_agricultural_qa.json') as f:
    qa_data = json.load(f)

# Speech data
import librosa
audio, sr = librosa.load('speech/Bengali/wavs/bin_0834_0030520634.wav')

# Vision data
from PIL import Image
img = Image.open('vision/Crop Classification/wheat/wheat_001.jpg')
```

#### 6.1.2 Common Query Patterns
- Filter by date range
- Group by crop/state/district
- Join weather and price data
- Sample balanced classes for training

### 6.2 Dataset Statistics API
```python
def get_dataset_stats(module):
    """Load summary statistics for a data module"""
    summary_path = f"{module}/dataset_summary.json"
    with open(summary_path) as f:
        return json.load(f)
```

## 7. Use Case Implementations

### 7.1 Price Prediction Model
**Data**: Market prices + Weather data
**Approach**: Time series forecasting with weather features
**Pipeline**: Load CSV → Feature engineering → Train model → Predict

### 7.2 Multilingual ASR System
**Data**: Speech data (9 languages)
**Approach**: Fine-tune Wav2Vec2 or Whisper
**Pipeline**: Load WAV + TSV → Preprocess → Train → Evaluate

### 7.3 Agricultural Chatbot
**Data**: Text Q&A
**Approach**: Fine-tune LLM (GPT, LLaMA) on Q&A pairs
**Pipeline**: Load JSON → Format for training → Fine-tune → Deploy

### 7.4 Crop Disease Classifier
**Data**: Vision disease detection
**Approach**: CNN (ResNet, EfficientNet)
**Pipeline**: Load images → Augment → Train → Validate

### 7.5 Multimodal Agricultural Assistant
**Data**: All modules
**Approach**: Combine ASR + Vision + Q&A retrieval
**Pipeline**: Voice input → ASR → Intent detection → Image analysis → Response generation

## 8. Scalability and Future Extensions

### 8.1 Horizontal Scaling
- Add more states and districts to market data
- Expand language coverage for speech
- Increase crop and disease classes in vision
- Grow Q&A dataset with more categories

### 8.2 Vertical Scaling
- Add soil data module
- Include satellite imagery
- Add farmer feedback and outcomes data
- Integrate real-time market feeds

### 8.3 Data Update Strategy
- Quarterly updates for market and weather data
- Annual updates for speech and vision datasets
- Continuous updates for Q&A based on user feedback
- Version numbering: MAJOR.MINOR.PATCH

## 9. Performance Considerations

### 9.1 Data Loading Optimization
- Use chunked reading for large CSV files
- Implement lazy loading for image datasets
- Cache frequently accessed metadata
- Use efficient data formats (Parquet for large tables)

### 9.2 Storage Efficiency
- Compress historical data archives
- Use appropriate image compression
- Deduplicate redundant data
- Implement tiered storage (hot/cold data)

### 9.3 Query Performance
- Index key columns (date, crop, state)
- Pre-compute common aggregations
- Use database for large-scale queries
- Implement caching layer

## 10. Security and Privacy

### 10.1 Data Anonymization
- Remove farmer-specific identifiers
- Aggregate sensitive transaction data
- Ensure no personal information in speech recordings

### 10.2 Access Control
- Public dataset with open license
- Attribution requirements for commercial use
- Rate limiting for API access (if applicable)

### 10.3 Data Integrity
- Checksums for file verification
- Digital signatures for official releases
- Audit logs for data modifications

## 11. Documentation and Metadata

### 11.1 Dataset Documentation
- README.md in each module directory
- Data dictionary with field descriptions
- Collection methodology documentation
- Usage examples and tutorials

### 11.2 Citation and Attribution
```
@dataset{sasya_ai_2024,
  title={Sasya AI: Multimodal Agricultural Dataset for Indian Agriculture},
  author={[Authors]},
  year={2024},
  publisher={[Publisher]},
  version={1.0}
}
```

### 11.3 License Information
- Specify open data license (CC BY 4.0 recommended)
- Attribute source datasets
- Define usage restrictions if any

## 12. Testing and Validation

### 12.1 Data Integrity Tests
- File existence checks
- Format validation
- Schema compliance
- Referential integrity (cross-module links)

### 12.2 Quality Metrics
- Completeness: % of expected records present
- Accuracy: % of correctly labeled data
- Consistency: % of data following standards
- Timeliness: Data freshness metrics

### 12.3 Automated Testing
```python
def test_market_data_integrity():
    df = pd.read_csv('market/agmarknet/historical_prices_2019_2024.csv')
    assert df['min_price'] <= df['modal_price']
    assert df['modal_price'] <= df['max_price']
    assert df['date'].is_monotonic_increasing
```

## 13. Deployment and Distribution

### 13.1 Distribution Channels
- GitHub repository (with Git LFS)
- Cloud storage (S3, Google Cloud Storage)
- Academic data repositories (Zenodo, Kaggle)
- Direct download links

### 13.2 Packaging
- Modular downloads (by data type)
- Complete dataset archive
- Sample datasets for quick start
- Docker containers with pre-loaded data

### 13.3 Update Mechanism
- Version tags in Git
- Changelog documentation
- Automated update notifications
- Backward compatibility guarantees

## 14. Correctness Properties

### 14.1 Data Consistency Properties
**Property 1.1**: For all price records, min_price ≤ modal_price ≤ max_price
**Property 1.2**: All dates fall within the specified range (2019-2024)
**Property 1.3**: All state and district names are from valid Indian administrative divisions

### 14.2 Completeness Properties
**Property 2.1**: Each speech audio file has a corresponding entry in the line index
**Property 2.2**: Each Q&A pair has both user and assistant messages
**Property 2.3**: Each disease detection crop has at least one healthy class

### 14.3 Format Properties
**Property 3.1**: All CSV files have consistent column counts per row
**Property 3.2**: All JSON files are valid and parseable
**Property 3.3**: All audio files are valid WAV format with readable headers

### 14.4 Referential Integrity Properties
**Property 4.1**: Weather data districts match market data districts
**Property 4.2**: Crop names in vision data match crop names in market data (where applicable)
**Property 4.3**: File references in metadata match actual files on disk

## 15. Implementation Roadmap

### Phase 1: Data Collection and Cleaning (Completed)
- Gather data from sources
- Clean and standardize formats
- Create directory structure

### Phase 2: Metadata and Documentation
- Generate summary files
- Write README documentation
- Create data dictionaries

### Phase 3: Validation and Testing
- Implement data quality checks
- Run integrity tests
- Fix identified issues

### Phase 4: Packaging and Release
- Create distribution packages
- Set up download infrastructure
- Publish dataset

### Phase 5: Maintenance and Updates
- Monitor data quality
- Collect user feedback
- Release periodic updates
