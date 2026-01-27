# AI SaaS Platform

## Architecture
- **Frontend**: Flutter Web (User to create)
- **Backend**: FastAPI (Python)
- **Auth**: Firebase
- **AI**: Gemini / OpenAI
- **Payments**: Stripe

## Setup Instructions

### 1. Backend (FastAPI)
The backend is located in the `backend/` folder.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend (Flutter)
Since Flutter requires a system-level installation, please run the following command in this root directory to scaffold the app:

```bash
flutter create frontend --platforms=web
```

Then, you can run it with:
```bash
cd frontend
flutter run -d chrome
```
