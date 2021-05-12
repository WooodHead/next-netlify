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
      quill: '<h1>This is the page title and URL</h1><h2>And this is the page description</h2><img src="https://d1yh8cksvv9kll.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtZGV2LWltYWdlc2J1Y2tldC1vaG12ZmN1a3h3aXYiLCJrZXkiOiJwdWJsaWMvMGNjMDRlYmUtY2YzYy00MDdmLTg3OGYtYzBkZjA4OGUzODgzLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6OTAwLCJoZWlnaHQiOjY3NSwiZml0IjoiY292ZXIifX19" height="300" width="400" ></img>[this is the img alt tag; h:300, w:400]',
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
      {selectedTopicState.lastSave && <div className="text-xs flex justify-center ">
        last updated: {selectedTopicState.lastSave}
      </div>}

    </div>
  )
}