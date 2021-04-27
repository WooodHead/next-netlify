import { v4 as uuidv4 } from 'uuid'

export default function TopicComponent(props) {
  const selectedTopicState = props.selectedTopicState
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)

  const onEdit = () => {
    setSelectedTopicState({ ...selectedTopicState, editing: true })
  }

  const createNewTopic = () => {
    setSelectedTopicState({
      topicId: uuidv4(),
      title: '',
      string: '',
      quill: '',
      editing: true
    })
  }

  return (
    <div >
      {selectedTopicState.title === ""
        ? <button onClick={() => createNewTopic()}>
            <div>create new topic</div>
          </button>
        : <button onClick={() => onEdit()}>
            <div>edit</div>
          </button>
      }
      <div className="flex justify-center">
        <div className="mx-3 my-3 prose-sm prose sm:prose"
          dangerouslySetInnerHTML={{ __html: selectedTopicState.string }} >
        </div>
      </div>
    </div>
  )
}