# LLM의 함수 호출 (Function Calling)

# Function Calling with LLMs

## Getting Started with Function Calling

Function calling is the ability to reliably connect LLMs to external tools to enable effective tool usage and interaction with external APIs.

LLMs like GPT-4 and GPT-3.5 have been fine-tuned to detect when a function needs to be called and then output JSON containing arguments to call the function. The functions that are being called by function calling will act as tools in your AI application and you can define more than one in a single request.

Function calling is an important ability for building LLM-powered chatbots or agents that need to retrieve context for an LLM or interact with external tools by converting natural language into API calls.

Functional calling enables developers to create:

* conversational agents that can efficiently use external tools to answer questions. For example, the query "What is the weather like in Belize?" will be converted to a function call such as `get_current_weather(location: string, unit: 'celsius' | 'fahrenheit')`
* LLM-powered solutions for extracting and tagging data (e.g., extracting people names from a Wikipedia article)
* applications that can help convert natural language to API calls or valid database queries
* conversational knowledge retrieval engines that interact with a knowledge base

In this guide, we demonstrate how to prompt models like GPT-4 and open-source models to perform function calling for different use cases.

## Function Calling with GPT-4

As a basic example, let's say we asked the model to check the weather in a given location.

The LLM alone would not be able to respond to this request because it has been trained on a dataset with a cutoff point. The way to solve this is to combine the LLM with an external tool. You can leverage the function calling capabilities of the model to determine an external function to call along with its arguments and then have it return a final response. Below is a simple example of how you can achieve this using the OpenAI APIs.

Let's say a user is asking the following question to the model:

```
What is the weather like in London?
```

To handle this request using function calling, the first step is to define a weather function or set of functions that you will be passing as part of the OpenAI API request:

```
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {
                        "type": "string", 
                        "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        },   
    }
]
```

The `get_current_weather` function returns the current weather in a given location. When you pass this function definition as part of the request, it doesn't actually executes a function, it just returns a JSON object containing the arguments needed to call the function. Here are some code snippets of how to achieve this.

You can define a completion function as follows:

```
def get_completion(messages, model="gpt-3.5-turbo-1106", temperature=0, max_tokens=300, tools=None):
    response = openai.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        tools=tools
    )
    return response.choices[0].message
```

This is how you can compose the user question:

```
messages = [
    {
        "role": "user",
        "content": "What is the weather like in London?"
    }
]
```

Finally, you can call the `get_completion` above and passing both the `messages` and `tools`:

```
response = get_completion(messages, tools=tools)
```

The `response` object contains the following:

```
ChatCompletionMessage(content=None, role='assistant', function_call=None, tool_calls=[ChatCompletionMessageToolCall(id='...', function=Function(arguments='{"location":"London","unit":"celsius"}', name='get_current_weather'), type='function')])
```

In particular, the `arguments` object contains the important arguments extracted by the model and that will be needed to complete the request.

You can then choose to call an external weather API for the actual weather. Once you have the weather information available you can pass it back to the model to summarize a final response given the original user question.

## Notebooks

🎓
---

## 핵심 개념

- LLM의 함수 호출 (Function Calling)의 정의 및 기본 원리
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
