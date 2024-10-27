from dotenv import load_dotenv
import os

from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
from langchain import PromptTemplate
from langchain.chains import LLMChain, SequentialChain
from langchain_ibm import WatsonxLLM
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from ibm_watsonx_ai.foundation_models.schema import TextChatParameters

def generate_response():

    load_dotenv()

    credentials = Credentials(
            url = "https://us-south.ml.cloud.ibm.com",
            api_key = os.getenv("WATSON_KEY")
            )

    client = APIClient(credentials)

    project_id = os.getenv("PROJECT_ID")
    if id:
        client.set.default_project(project_id)


    model_id = "mistralai/mistral-large"

    params = TextChatParameters(
        temperature=1
    )

    model = ModelInference(
        model_id=model_id,
        credentials=credentials,
        project_id=project_id,
        params=params
    )

    messages = [
        {
            "role": "system",
            "content": "You are a weather expert."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "How do hurricanes impact hospital load?"
                }
            ],
        },
        {
            "role": "assistant",
            "content": "Hurricanes cause increased stress on hospitals during and after they hit."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "How do hospitals prepare?"
                }
            ],
        }
    ]

    advanced_chat_response = model.chat(messages=messages)
    return advanced_chat_response["choices"][0]["message"]["content"]





#    GenParams.DECODING_METHOD: DecodingMethods.SAMPLE.value,
#    GenParams.MAX_NEW_TOKENS: 100,
#    GenParams.MIN_NEW_TOKENS: 1,
#    GenParams.TEMPERATURE: 0.5,
#    GenParams.TOP_K: 50,
#    GenParams.TOP_P: 1
#}
#
#ai_params = {
#    "url": credentials["url"],
#    "apikey": credentials["apikey"],
#    "project_id": id,
#    "generation_parameters": parameters
#}
#
#
#def chain_text_generator(params=ai_params):
#    
#    url = params["url"]
#    apikey = params["apikey"]
#    project_id = params['project_id']
#    parameters = params['generation_parameters']
#    flan_ul2_llm = WatsonxLLM(model_id=ModelTypes.FLAN_UL2.value, url=url, apikey=apikey, project_id=project_id, params=parameters)
#    flan_t5_llm = WatsonxLLM(model_id=ModelTypes.FLAN_T5_XXL.value, url=url, apikey=apikey, project_id=project_id)
#    prompt_1 = PromptTemplate(input_variables=["topic"], template="Generate a fact about hurricane impact on {topic}: Fact: ")
#    prompt_2 = PromptTemplate(input_variables=["fact"], template="Validate this fact: {fact}")
#    prompt_to_flan_ul2 = LLMChain(llm=flan_ul2_llm, prompt=prompt_1, output_key='fact')
#    flan_to_t5 = LLMChain(llm=flan_t5_llm, prompt=prompt_2, output_key='answer')
#    chain = SequentialChain(chains=[prompt_to_flan_ul2, flan_to_t5], input_variables=["topic"], output_variables=['fact', 'answer'])
#
#    def score(payload):
#        """Generates fact based on provided topic and returns the reasoning."""
#
#        answer = chain.invoke({"topic": payload["input_data"][0]['values'][0][0]})
#        return {'predictions': [{'fields': ['topic', 'fact', 'answer'], 'values': [answer['topic'], answer['fact'], answer['answer']]}]}
#
#    return score
#
#
#sample_payload = {
#    "input_data": [
#        {
#            "fields": ["topic"],
#            "values": [["hurricane"]]
#        }
#    ]
#}
#
#inference = chain_text_generator()
#inf = inference(sample_payload)
#print(inf)
