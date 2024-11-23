from openai import OpenAI
client = OpenAI()
assistant_id = "asst_IDASp9o2BX2zy7hzMTeJGCz6"
assistant = client.beta.assistants.retrieve(assistant_id = assistant_id)
#print(assistant)

thread_id = ""

def createThread():
    new_thread = client.beta.threads.create()
    return new_thread.id

def destroyThread(thread_id: str):
    response = client.beta.threads.delete(thread_id = thread_id)
    return response.deleted

def analyzeFile(file, instructions:str, id_thread = "", message:str = ""):
    #uploaded = client.files.create(file = file, purpose="assistants")
    uploaded = client.beta.vector_stores.file_batches.upload_and_poll(
        vector_store_id="vs_LKVFCV8OXMseGID0ECJzKaMx",
        files = [file],
    )
    global assistant
    assistant = client.beta.assistants.update(
        assistant_id = assistant_id,
        tool_resources={"file_search": {"vector_store_ids" : ["vs_LKVFCV8OXMseGID0ECJzKaMx"]}}
    )
    global thread_id
    id_thread = thread_id
    new_message = client.beta.threads.messages.create(
        id_thread,
        role="user",
        content=message,
        attachments=[{"file_id" : uploaded.id, "tools" : [{"type":"file_search"}]}]
        )
    run = client.beta.threads.runs.create_and_poll(thread_id = id_thread, assistant_id = assistant_id, additional_instructions=instructions)
    messages = client.beta.threads.messages.list(
        thread_id=id_thread,
    )
    print(messages.data[0].content[0].text.value)