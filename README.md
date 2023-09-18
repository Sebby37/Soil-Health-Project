# AI IOT Soil Health Project
## Info
This is the repository that contains the code for my soil health project. I wrote it for a competition I entered in the 2023 Royal Adelaide Show (and won!) using a Runlinc board, various sensors (see below) and an AI language model for question answering about the data.

## Folder Structure
- **llama-server/** - The Flask server I used for serving the model to the frontend.
- **runlinc-saves/** - Contains the saves of the Runlinc project files.
- **webui/** - Contains the HTML/CSS/JS files I used to work on the frontend. These may be slightly different to the HTML saved in the Runlinc saves due to some on-the-fly editing done in the editor.

## Runlinc
[Runlinc](https://runlinc.com/) is the platform I built this project on. It is an IOT development board that lets you write web interfaces with data that can be collected through sensors connected to the board. I am currently an intern there and wrote the interface between the board and the NPK sensor.

## Sensors
I used the following sensors:
- [Arduino Compatible Soil Moisture Sensor (XC4604)](https://www.jaycar.com.au/duinotech-arduino-compatible-soil-moisture-sensor-module/p/XC4604)
- [Arduino Compatible Rain Sensor (XC4603)](https://www.jaycar.com.au/duinotech-arduino-compatible-rain-sensor-module/p/XC4603)
- [DHT11 Arduino Compatible Temperature and Humidity Sensor](https://www.jaycar.com.au/arduino-compatible-temperature-and-humidity-sensor-module/p/XC4520)
- [NPK Sensor (see below for more info)](https://www.aliexpress.com/item/1005003022224473.html)

**The NPK Sensor**
This is a cheap-ish sensor from China that was bought from aliexpress, as Jaycar didn't sell it. Due to this it was difficult finding documentation, so I have included below the links to the 2 datasheets I referenced:
- https://www.imiconsystem.com/wp-content/uploads/2021/05/Soil-Nitrogen-Phosphorus-and-Potassium-Three-in-One-Fertility-Sensor-Model-485-1.pdf
- https://5.imimg.com/data5/SELLER/Doc/2022/6/XB/EU/YX/5551405/soil-sensor-jxbs-3001-npk-rs.pdf

## AI Language Model
**The Model**
For this project, I opted to use an Airoboros model (thanks Jon Durbin!) due to the Context Obedient question answering capabilities. 
For this project I used a Llama 1-based model (v1.4), however I plan on upgrading to a Llama-2 based model. 
I also used the Q4_K_M quantization, however when I upgrade to Llama-2 I'll probably switch to Q5_K_M. 
The model I used can be acquired from TheBloke who quantized it to GGML if you don't want to quantize it yourself.
Get the model here:
- [Airoboros 7B GPT4 1.4](https://huggingface.co/TheBloke/airoboros-7B-gpt4-1.4-GGML)

**Inference**
For inference with the model, I used [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) by abetlen, which are Python bindings for [llama.cpp](https://github.com/ggerganov/llama.cpp) by Georgi Gerganov

**Requirements**
In order to run this model, you'll need to meet the requirements to run 7B Llama models. As this is a GGML/GGUF model, it runs entirely through CPU and RAM, so you shouldn't need to worry about a GPU. For the RAM, 8GB is the maximum you'll need if you want to run this specific model, however in practice the model will likely not use nearly that much RAM. For the CPU, I'd choose a CPU with as many cores as possible and as fast speed as possible, as the CPU speed determines the amount of tokens/words per second the model will generate.
I run this model on a laptop with 2 sticks of 16gb of RAM at 3200 MHz per stick, and a 12th gen Intel I5. I get 4-5 tokens per second with the parameters set in the server.py file, with my RAM usage jumping to ~250 mb and CPU jumping to ~75%.

## Server
To interface with the model, I wrote a small Flask server that exposes an endpoint where the question and sensor info is sent to. This endpoint processes that data into a prompt for the LLM, prompts the LLM with said prompt and returns the answer. For requirements, see llama-server/requirements.txt

## License
Right now I'm going with the GPL license because I like free software and want to give back to the OSS community, however in the future this may change depending on the circumstances (although I'd much rather keep it GPL). If I can't change the license please let me know.
