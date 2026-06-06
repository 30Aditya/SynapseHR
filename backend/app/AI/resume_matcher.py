from sentence_transformers import SentenceTransformer
from sentence_transformers import util

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def calculate_score(
    resume_text: str,
    jd_text: str
):

    resume_embedding = model.encode(
        resume_text,
        convert_to_tensor=True
    )

    jd_embedding = model.encode(
        jd_text,
        convert_to_tensor=True
    )

    similarity = util.cos_sim(
        resume_embedding,
        jd_embedding
    )

    return round(
        similarity.item() * 100,
        2
    )


def find_missing_skills(
    resume_text: str,
    required_skills: str
):

    skills = [
        s.strip()
        for s in required_skills.split(",")
    ]

    missing = []

    resume_lower = resume_text.lower()

    for skill in skills:

        if skill.lower() not in resume_lower:
            missing.append(skill)

    return missing


def recommendation(score):

    if score >= 90:
        return "Strong Hire"

    if score >= 75:
        return "Shortlist"

    if score >= 60:
        return "Consider"

    return "Reject"