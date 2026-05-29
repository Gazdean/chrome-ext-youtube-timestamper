import { Button } from "react-bootstrap";
import { navigateActiveTab } from "../chromeHelpers";
import { APP_CONFIG } from "../constants";

export default function InvalidPage() {

  const handleOnClick = () => {
    navigateActiveTab(APP_CONFIG.YOUTUBE_HOMEPAGE_URL)
  }

  return (
    <div>
      <h2>Extension Disabled</h2>
      <p>Go to<Button variant="link" onClick={handleOnClick} type="button">YouTube</Button>to create timestamps</p>
    </div>
  )
}
