import { useNavigate } from "react-router-dom"

function ButtonBack() {
  const navigate = useNavigate()
  return (
    <>
      <div className="hover:bg-gray-200 w-max px-3 group py-1 rounded-sm">
        <button onClick={() => navigate("/")} className="group-hover:cursor-pointer">kembali</button>
      </div>
    </>
  )
}

export default ButtonBack