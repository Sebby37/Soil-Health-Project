import flask
from llama_cpp import Llama

# Global stuff that is unavoidably global
app = flask.Flask(__name__)
llm = Llama("airoboros-7b-gpt4-1.4.ggmlv3.q4_K_M.bin", n_ctx=384, seed=-1, n_threads=12)

# The prompt to use
FULL_PROMPT = """USER: BEGININPUT
BEGINCONTEXT
{SENSORS}
ENDCONTEXT
Soil is too dry if below 25% moisture, and too wet if above 55%
The optimal nitrogen content in soil should be within 10 mg/kg and 50 mg/kg
The optimal phosphorus content in soil should be within 200 mg/kg and 1500 mg/kg
The optimal potassium content in soil should be within 100 mg/kg and 150 mg/kg
The optimal temperature should be within 21 and 29 degrees celcius
The optimal humidity should be within 60 and 70%
ENDINPUT
BEGININSTRUCTION
{QUESTION}
ENDINSTRUCTION
ASSISTANT: """

# CORS thingie so browsers don't throw a hissie fit
@app.after_request
def add_header(response):
    # Good lord CORS sucks, this took me so goddamn long to figure out
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# The text completion stuff
@app.route("/", methods=["POST"])
def question_answer():
    # Get form from request
    form = flask.request.json
    question = form["question"] # The question the user wants answered
    sensors_dict = form["sensors"] # The sensors with name as key and value as value
    
    print("Question asked:", question)
    
    # Format the sensors information
    sensors = ""
    for sensor in sensors_dict:
        sensors += sensor + ": " + sensors_dict[sensor] + "\n"
    
    # Create prompt
    prompt = FULL_PROMPT
    prompt = prompt.replace("{SENSORS}", sensors.strip())
    prompt = prompt.replace("{QUESTION}", question.strip())
    #open("prompt.txt", "w+").write(prompt)
    
    # Get the answer to the question
    answer = llm(prompt, max_tokens=64, stop=["###", "\n\n", "HUMAN:", "RESPONSE:"], top_p=0.5, temperature=0.1, mirostat_mode=2)
    answer = answer["choices"][0]["text"].strip()
    
    # Send a sort of dummy answer if the model refused to respond
    if len(answer) <= 0:
        answer = "No response from AI."
    
    print("Got answer:", answer)
    
    return answer

if __name__ == "__main__":
    app.run("0.0.0.0")
