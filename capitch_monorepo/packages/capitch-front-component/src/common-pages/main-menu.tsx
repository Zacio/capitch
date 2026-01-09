import { Link } from "react-router"
import CapitchButton from "../components/capitch-button"

function MainMenu() {

  return (
    <>
      <CapitchButton><Link to="/waiting-room">Screen display</Link></CapitchButton>
      <CapitchButton>Play</CapitchButton>
    </>
  )
}

export default MainMenu