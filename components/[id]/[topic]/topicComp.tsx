import SideUserIsland from './sideUserIsland'
import TopUserIsland from './topUserIsland'
import CommentComp from './commentComp'

export default function TopicComp(props) {
  const user = props.user
  const topic = props.topic

  let dateString = ''
  if (topic.lastSave) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"]
    const lastSaveDate = new Date(JSON.parse(topic.lastSave))
    const day = lastSaveDate.getDate()
    const month = lastSaveDate.getMonth()
    const year = lastSaveDate.getFullYear()
    dateString = '' + monthNames[month] + ' ' + day + ' ' + year
  }

  return (
    <div className="flex my-5 bg-gray-100">

      <div className="flex justify-center flex-1 mt-10">
        <SideUserIsland user={user} />
      </div>

      <div className="mx-5">
        <TopUserIsland user={user} />
        <div className="my-10">
          <div
            className="prose-sm prose sm:prose"
            dangerouslySetInnerHTML={{ __html: topic.string }}
          ></div>
          <div className="flex justify-center">
            < CommentComp user={user} />
          </div>
          <div className="flex justify-center my-3 text-xs">last updated: {dateString} </div>
        </div>
      </div>

      <div className="flex-1">
      </div>


    </div>
  )
}