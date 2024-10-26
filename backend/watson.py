from dotenv import load_dotenv
import os

from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

def main():
    load_dotenv()

    creds = Credentials(
            url = "https://us-south.ml.cloud.ibm.com",
            api_key = os.getenv("WATSON_KEY")
            )

    client = APIClient(creds)

    id = os.getenv("PROJECT_ID")
    if id:
        client.set.default_project(id)

    generate_params = {
        GenParams.MAX_NEW_TOKENS: 100
    }

    model = ModelInference(
        model_id="ibm/granite-13b-chat-v2",
        credentials=creds,
        api_client=client,
        project_id=id,
        params=generate_params
    )

    q = "How far is Paris from Bangalore?"
    gen_resp = model.generate_text(prompt=q)
    print(gen_resp)


main()
