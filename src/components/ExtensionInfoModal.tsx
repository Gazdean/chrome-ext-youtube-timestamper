import type { Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import type { StoredConfig } from '../types';
import { STORAGE_LIMITS } from '../constants';

interface DetailModalProps{
  setShowModal: Dispatch<SetStateAction<boolean>>
}

export default function ExtensionInfoModal({setShowModal}: DetailModalProps) {
  
  const handleOnClick = () => {
    setShowModal(false)
    void chrome.storage.local.get("extSettings", (data) => {
      const config = data as StoredConfig
      const currSettings = config.extSettings || {}
      void chrome.storage.local.set({extSettings: {...currSettings, showUserInfoModal: false}});  
    })
  }
  
  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'absolute' }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton onClick={handleOnClick}>
          <Modal.Title>Extension Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This extension allows you to create a list of timestamps for the YouTube video you are watching.</p>
          <p>Click the <strong>Mark Timestamp</strong> button to add upto <strong>{STORAGE_LIMITS.MAX_TIMESTAMPS_PER_VIDEO}</strong> timestamps for a maximum of <strong>{STORAGE_LIMITS.MAX_VIDEOS}</strong> videos.</p>
          <p>Click <strong>Add Description</strong> to add a short description to your timestamp.</p>
          <p>Turn the <strong>Auto Pause</strong> option on to automatically pause the video when you click the Mark Timestamp button. This gives you time to write a description for the timestamp. The video will restart automatically on submission of your description</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleOnClick}>Close</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}


