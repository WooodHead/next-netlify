import React from 'react'

export default function TAVS(props) {
  const tavsState = props.tavsState
  const setTavsState = (e) => props.setTavsState(e)
console.log(tavsState)
  const CustomCheckbox = (CCprops) => (
    <div
      className="ml-3"
      style={{ cursor: "pointer" }}
      onClick={() => setTavsState({...tavsState, [CCprops.TAVS]: !tavsState[CCprops.TAVS]})}
    >
      <input 
        className="mr-1"
        onChange={null}
        style={{ cursor: "pointer" }}
        type="checkbox" 
        defaultChecked={tavsState[CCprops.TAVS]} 
        name={CCprops.TAVS}
        value="hello"
      />
      {CCprops.TAVS}
    </div>
  );

  return (
    <div>
      <button onClick={() => setTavsState({...tavsState, editing: true})}>edit</button>
      {tavsState.editing 
        && <div>
          editing
          <CustomCheckbox TAVS={"text"} />
          <CustomCheckbox TAVS={"audio"} />
          <CustomCheckbox TAVS={"video"} />
          <CustomCheckbox TAVS={"screen"} />
        </div>}
    </div>
    
  )
}