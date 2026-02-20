# Gemini 1.5 Flash의 컨텍스트 캐싱

# Context Caching with Gemini 1.5 Flash

Google recently released a new feature called [context-caching (opens in a new tab)](https://ai.google.dev/gemini-api/docs/caching?lang=python) which is available via the Gemini APIs through the Gemini 1.5 Pro and Gemini 1.5 Flash models. This guide provides a basic example of how to use context-caching with Gemini 1.5 Flash.

[https://youtu.be/987Pd89EDPs?si=j43isgNb0uwH5AeI (opens in a new tab)](https://youtu.be/987Pd89EDPs?si=j43isgNb0uwH5AeI)

### The Use Case: Analyzing a Year's Worth of ML Papers

The guide demonstrates how you can use context caching to analyze the summaries of all the [ML papers we've documented over the past year (opens in a new tab)](https://github.com/dair-ai/ML-Papers-of-the-Week). We store these summaries in a text file, which can now be fed to the Gemini 1.5 Flash model and query efficiently.

### The Process: Uploading, Caching, and Querying

1. **Data Preparation:** First convert the readme file (containing the summaries) into a plain text file.
2. **Utilizing the Gemini API:** You can upload the text file using the Google `generativeai` library.
3. **Implementing Context Caching:** A cache is created using the `caching.CachedContent.create()` function. This involves:
   * Specifying the Gemini Flash 1.5 model.
   * Providing a name for the cache.
   * Defining an instruction for the model (e.g., "You are an expert AI researcher...").
   * Setting a time-to-live (TTL) for the cache (e.g., 15 minutes).
4. **Creating the Model:** We then create a generative model instance using the cached content.
5. **Querying:** We can start querying the model with natural language questions like:
   * "Can you please tell me the latest AI papers of the week?"
   * "Can you list the papers that mention Mamba? List the title of the paper and summary."
   * "What are some of the innovations around long-context LLMs? List the title of the paper and summary."

The results were promising. The model accurately retrieved and summarized information from the text file. Context caching proved highly efficient, eliminating the need to repeatedly send the entire text file with each query.

This workflow has the potential to be a valuable tool for researchers, allowing them to:

* Quickly analyze and query large amounts of research data.
* Retrieve specific findings without manually searching through documents.
* Conduct interactive research sessions without wasting prompt tokens.

We are excited to explore further applications of context caching, especially within more complex scenarios like agentic workflows.

The notebook can be found below:

[Context Caching with Gemini APIs](https://github.com/dair-ai/Prompt-Engineering-Guide/blob/main/notebooks/gemini-context-caching.ipynb)

🎓
---

## 핵심 개념

- Gemini 1.5 Flash의 컨텍스트 캐싱의 정의 및 기본 원리
- LLM 프롬프팅에서의 실무 활용 방식
- 성공적인 구현을 위한 핵심 요소
- 일반적인 실패 사례 및 해결 방법
- 성능 평가 및 최적화 전략

## 왜 중요한가

현대의 대규모 언어 모델(LLM)을 효과적으로 활용하기 위해서는 프롬프팅 기법에 대한 깊이 있는 이해가 필수적입니다. 이 섹션에서 다루는 내용들은 실무에서 마주치는 다양한 문제들을 해결하고, LLM의 능력을 최대한 활용하는 방법을 제시합니다.

## 시험 포인트

- 개념 간 관계 및 차이점 파악
- 실제 구현 과정에서의 주의사항
- 예상 가능한 오류 모드 (failure modes)
- 프로덕션 환경에서의 제약사항
- 성능 최적화 및 비용 고려사항
