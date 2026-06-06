import os

import google.generativeai as genai

from dotenv import load_dotenv
from google.api_core.exceptions import (
    ResourceExhausted
)

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def evaluate_candidate(
    resume_text,
    transcript
):

    prompt = f"""
You are a senior HR manager and technical interviewer.

Evaluate the candidate based on:

1. Technical Knowledge
2. Communication Skills
3. Problem Solving Ability
4. Project Experience
5. Internship Experience
6. Overall Employability

Candidate Resume:
{resume_text}

Interview Transcript:
{transcript}

Return the response in the following format:

Technical Score: X/10

Communication Score: X/10

Problem Solving Score: X/10

Strengths:
- point 1
- point 2
- point 3

Weaknesses:
- point 1
- point 2

Recommendation:
Reject / Hold / Proceed

Overall Summary:
2-3 paragraph evaluation
"""

    try:

        response = model.generate_content(
            prompt
        )

        return response.text

    except ResourceExhausted:

        return """
Technical Score: N/A

Communication Score: N/A

Problem Solving Score: N/A

Strengths:
- Interview completed successfully

Weaknesses:
- AI evaluation unavailable due to API quota limits

Recommendation:
Manual Review Required

Overall Summary:
The interview transcript has been recorded successfully.
AI evaluation could not be generated because the Gemini API quota
was exceeded. Please review the transcript manually.
"""

    except Exception as e:

        return f"""
Technical Score: N/A

Communication Score: N/A

Problem Solving Score: N/A

Strengths:
- Interview completed successfully

Weaknesses:
- AI evaluation service unavailable

Recommendation:
Manual Review Required

Overall Summary:
An error occurred while generating the AI evaluation.

Error:
{str(e)}
"""