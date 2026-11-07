import sys
import pptx

sys.stdout.reconfigure(encoding='utf-8')
prs = pptx.Presentation(r'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx')
print(f"Total slides: {len(prs.slides)}")
for i, slide in enumerate(prs.slides):
    texts = [s.text.strip().replace('\n', ' ') for s in slide.shapes if s.has_text_frame and s.text.strip()]
    sample = texts[:2] if texts else ["EMPTY"]
    print(f"Slide {i+1}: {sample}")
