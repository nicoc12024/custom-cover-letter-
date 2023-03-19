import PyPDF2
from django.http import JsonResponse
from rest_framework.views import APIView
import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def generate_cover_letter(cv_text, prompt):
    completions = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"{prompt}:\n{cv_text}",
        max_tokens=2000,
        n=1,
        stop=None,
        temperature=0.7,
    )
    message = completions.choices[0].text.strip()
    return message

class ExtractPDFView(APIView):
    def post(self, request):
        pdf_file = request.FILES['pdf_file']
        with pdf_file.open(mode='rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = []
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text.append(page.extract_text())

        cv_text = "\n".join(text)
        prompt = "Make a cover letter based on my CV (text) applying for a job [job title of the job]. Do not talk too much about my training but focus on my last job. Also in the cover letter leave a paragraph for me to talk about why i want to work for your company, could be something like: I am drawn to [Company Name] due to its focus on [company values or projects] and commitment to [specific technology or industry]. This aligns with my passion for [relevant skills or experience], and I'm eager to contribute to the companys success while further developing my skills and supporting its mission and goals."
        cover_letter = generate_cover_letter(cv_text, prompt)

        return JsonResponse({'cover_letter': cover_letter})
