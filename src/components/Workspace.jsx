const Workspace=({motions})=>{
return (
    <div className="bg-blue-400 w-1/2 h-1/2 flex flex-col items-center">
        Motion stack
        <div>
            {
                motions?.map((motion,index)=>(
                    <div key={index} className="flex gap-2">
                        <div>{motion.type}</div>
                      {motion.type==='goto'?<div>x: {motion.value.x} y:{motion.value.y}</div>:  <div>{motion.value}</div>}
                    </div>
                ))
            }
          {/* <div>motion</div>
          <div>motion</div>
          <div>motion</div>
          <div>motion</div> */}
        </div>
      </div>
)
}

export default Workspace;