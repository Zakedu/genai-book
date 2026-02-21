# 이미지 생성 프롬프팅

Text-to-Image AI (DALL-E 3, Midjourney, Stable Diffusion 등)는 자연어 설명만으로 이미지를 생성합니다. 정확한 프롬프트 작성이 성공의 핵심입니다.

## 핵심 개념

### 1. 주요 이미지 생성 모델

| 모델 | 특징 | 가격 | 추천 |
|------|------|------|------|
| **DALL-E 3** | OpenAI, 세밀함, 자연스러움 | 고가 | 전문 콘텐츠 |
| **Midjourney** | 예술성, 스타일 다양함 | 중가 | 크리에이티브 |
| **Stable Diffusion** | 저가, 오픈소스, 커스터마이징 | 저가 | 대량 생성, 실험 |
| **Adobe Firefly** | 상업용, 일관성 | 중가 | 기업 마케팅 |

### 2. 이미지 생성 프롬프트의 구조

```
【기본 구조】
[주제/객체] + [상세 설명] + [스타일] + [조명/분위기] + [기술적 설정]

【예시】
"A sleek MacBook on a wooden desk,
professional office setting,
warm afternoon lighting,
shot from above at 45 degrees,
hyper-realistic photograph,
shot on Canon R5"
```

### 3. 프롬프트의 핵심 요소

**주제 (Subject)**: 무엇을 그릴 것인가
- 명사 중심의 구체적 표현
- "woman" → "a 30-year-old Korean woman with elegant posture"

**상세 설명 (Details)**: 어떤 특징인가
- 외형, 의상, 배경, 소품 등
- 색상, 질감, 재질 명시

**스타일 (Style)**: 어떤 화풍인가
- "oil painting", "watercolor", "3D render", "photograph"
- "cyberpunk", "minimalist", "surrealist"

**조명/분위기 (Lighting/Mood)**: 어떤 느낌인가
- 조명: "warm golden light", "harsh shadows", "soft diffused light"
- 분위기: "dramatic", "serene", "energetic"

**기술적 설정 (Technical)**: 촬영/기술 정보
- "wide-angle lens", "macro photography", "4K resolution"
- "8K, cinematic, award-winning"

## 실무 활용 예제

### 예제 1: 제품 마케팅 이미지 (DALL-E 3)

#### 상황
새로운 스마트워치를 출시하는 시즈 회사.
마케팅용 고품질 제품 이미지가 필요합니다.

#### 프롬프트

```
A sleek, modern smartwatch with a circular metallic face,
displayed on a polished white marble surface.
The watch features a thin metal band in rose gold,
with a bright AMOLED screen showing health metrics.
Soft, diffused studio lighting casting subtle shadows,
product photography style,
clean, minimalist background,
professional product shot,
8K resolution, sharp focus, product lighting,
shot with a 50mm macro lens.
```

#### 팁
- 색상명 구체화: "rose gold" 대신 "champagne rose metallic"
- 각도 지정: "shot from 45 degrees above, slight left angle"
- 배경 간결: 제품에 포커스를 맞추기 위해 "white marble", "soft shadows"로 제한

### 예제 2: SNS 콘텐츠 이미지 (Midjourney)

#### 상황
피트니스 브랜드가 인스타그램 피드용 이미지가 필요합니다.
따뜻하고 영감을 주는 분위기를 원합니다.

#### 프롬프트

```
A fit Korean woman in her late 20s wearing pastel pink sportswear,
doing a yoga pose (downward dog) on a white fluffy yoga mat.
Golden hour sunlight streaming through large windows,
wooden flooring, minimalist apartment interior,
succulent plants on windowsill,
warm, peaceful, aspirational mood,
illustration style with soft watercolor undertones,
modern, aesthetic, instagrammable,
shot with natural lighting,
well-composed, balanced composition.
--ar 1:1 --niji
```

#### 팁 (Midjourney 고유)
- `--ar 1:1`: 정사각형 (인스타그램용)
- `--niji`: 일러스트레이션 스타일 강화
- 색상 팔레트: "pastel pink", "golden hour", "white"로 통일

### 예제 3: 카페 인테리어 컨셉 이미지 (Stable Diffusion)

#### 상황
로컬 카페가 리뉴얼할 예정입니다.
새로운 인테리어 컨셉 이미지를 만들어 투자자에게 설득해야 합니다.

#### 프롬프트

```
A cozy, modern Korean cafe interior with warm oak wood finishes,
large floor-to-ceiling windows letting in natural morning light,
minimal scandinavian aesthetic with plants hanging from ceiling,
customers sitting at marble-topped tables with wooden chairs,
exposed brick wall with neon "coffee" sign in warm amber,
steam rising from coffee cups, warm ambient lighting,
professional interior design photo,
architectural photography style,
shot by an interior designer, magazine quality,
realistic, detailed, volumetric lighting,
4K, well-lit, professional photography.
```

#### 팁
- 공간감: "floor-to-ceiling windows", "exposed brick wall"
- 실용성: "marble-topped tables with wooden chairs" (사용 가능한 가구)
- 재질 명시: "oak wood", "brick", "marble"로 입체감 강조

### 예제 4: 광고 배너 이미지 (온라인 교육)

#### 상황
온라인 영어 교육 플랫폼의 광고 배너가 필요합니다.
클릭 유도율이 높아야 합니다.

#### 프롬프트

```
A vibrant, dynamic image of a diverse group of 3-4 students
(mix of ages 18-30, different ethnicities),
looking excited and engaged while learning English online.
One student smiling at laptop screen with headphones,
others holding notebooks and gesturing enthusiastically,
bright, modern classroom or home office setting,
soft colorful gradient background (blue to purple),
modern illustration style with bold, clean lines,
uplifting, positive, motivational mood,
flat design elements, contemporary aesthetic,
professional marketing imagery,
optimized for web banners (1200x600),
bright, eye-catching colors,
high contrast, engaging composition.
```

#### 팁
- 다양성: "diverse group", "mix of ages" → 타겟 확대
- 감정: "excited", "engaged", "enthusiastic" → 클릭 유도
- 기술사양: "1200x600" 배너 크기 지정
- 스타일: "flat design", "bold colors" → 배너용 시각성

### 예제 5: 한국식 콘셉트 이미지

#### 상황
K-뷰티 브랜드의 새로운 에센스 출시.
한국미를 강조한 프리미엄 이미지가 필요합니다.

#### 프롬프트

```
A luxury Korean beauty product (glass essence bottle with rose gold cap)
placed on silk fabric with subtle floral Korean patterns,
traditional porcelain teacup with ginseng tea steaming beside it,
minimalist composition with Korean aesthetic elements,
soft peachy-pink and cream color palette,
natural morning light with subtle window shadows,
shot from above at slight angle,
professional luxury beauty photography,
high-end magazine editorial style,
shot with macro lens, shallow depth of field,
pristine, elegant, timeless,
embodying Korean beauty philosophy (natural, radiant skin),
luxury product photography, 8K resolution,
professionally lit, museum-quality aesthetic.
```

#### 팁
- 문화적 요소: "Korean patterns", "porcelain teacup", "ginseng tea"
- 프리미엄 연출: "silk fabric", "rose gold", "luxury photography"
- 색상통일: "peachy-pink and cream" → 브랜드 아이덴티티

## 💡 실전 팁

!!! tip "효과적인 프롬프트 작성"

    1. **구체적일수록 좋다**
       ```
       × "아름다운 여자"
       ○ "a 28-year-old Korean woman with porcelain skin,
          long wavy black hair, wearing an elegant cream-colored hanbok"
       ```

    2. **부정적 표현도 활용 (Negative Prompt)**
       ```
       --no blurry, low-quality, distorted faces, watermark
       ```

    3. **색상 팔레트 통일**
       ```
       "warm golden color palette", "cool blue and gray tones"
       으로 색감 일관성 유지
       ```

    4. **스타일 참고 (Reference)**
       ```
       "in the style of [유명 사진작가명]"
       "resembling the aesthetic of [영화명]"
       ```

    5. **비율 지정 (가로:세로)**
       ```
       --ar 16:9 (와이드 영화 화면)
       --ar 9:16 (핸드폰 세로)
       --ar 1:1 (정사각형 SNS)
       ```

!!! tip "모델별 차이점 이해"

    **DALL-E 3**: 자연스럽고 정확함 → 상세한 프롬프트 추천
    **Midjourney**: 예술성 강함 → 스타일 지정 필수
    **Stable Diffusion**: 유연함 → 여러 번 반복 생성해 선택

!!! tip "자주 하는 실수"

    ```
    × "사람이 없는 아름다운 풍경" (불명확)
    ○ "a serene Jeju Island coastal landscape at golden hour,
       no people, clear blue sky, traditional stone wall in foreground"

    × "좋은 품질" (주관적)
    ○ "professional photography, sharp focus, well-lit,
       award-winning quality, 8K resolution"

    × 과도한 설명 (토큰 낭비)
    ○ 5-7개 핵심 요소만 명시
    ```

## 생성 후 최적화

1. **여러 버전 생성**: 같은 프롬프트로 4-5개 생성 후 선택
2. **Variation 활용**: 마음에 드는 이미지를 기반으로 변형
3. **Upscaling**: 최종 선택 이미지를 고해상도로 확대
4. **편집**: 필요시 Photoshop/Figma로 추가 편집

## 📝 핵심 정리

| 항목 | 내용 |
|------|------|
| **핵심 기능** | Text-to-Image 생성, 상품/마케팅 이미지, 개념 아트 |
| **핵심 요소** | 주제, 상세, 스타일, 조명, 기술 설정 |
| **성공 요소** | 구체성, 색상 팔레트 통일, 스타일 명시 |
| **주의사항** | 저작권 확인, 초상권 고려, 저품질 검사 |
| **프롬프트 팁** | 명사 중심, 구체적 형용사, 기술 사양 포함 |
| **활용 분야** | 마케팅, SNS, 제품샷, 광고, 인테리어 설계 |
| **최적 모델** | DALL-E (정확도), Midjourney (예술성), Stable Diffusion (커스터마이징) |
