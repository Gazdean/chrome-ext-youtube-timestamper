import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import type { ExtSettings, StoredConfig } from "../types";
import { APP_INFO } from "../constants";

import ExtensionInfoModal from "../components/ExtensionInfoModal";
import MainContent from "../components/MainContent";

function App() {
  const [showModal, setShowModal] = useState(true);

  // ExtSettings useEffect
  useEffect(() => {
    // Check chrome.storage to see if the user has already seen the info modal
    void chrome.storage.local.get("extSettings", (data) => {
      const config = data as StoredConfig;

      if (!config.extSettings) {
        const isSystemDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;

        const defaultSettings: ExtSettings = {
          showUserInfoModal: true,
          isDarkMode: isSystemDarkMode,
        };
        
        chrome.storage.local.set({ extSettings: defaultSettings });
        setShowModal(true);
      } else {
        const { showUserInfoModal } = config.extSettings;
        setShowModal(showUserInfoModal);
      }
    });
  }, []);

  return (
    <>
      <Container className="mt-4 mb-3">
        <Row>
          <Col xs="auto">
            <h1 className="h1 fw-bold text-body-emphasis">
              {APP_INFO.APP_TITLE}
            </h1>
          </Col>
          <Col>
            <Button
              variant="outline-info"
              className={`${showModal && "bg-info text-black"}`}
              onClick={() => setShowModal(true)}
            >
              Info
            </Button>
          </Col>
        </Row>
      </Container>

      <MainContent />

      {showModal && <ExtensionInfoModal setShowModal={setShowModal} />}
    </>
  );
}

export default App;
