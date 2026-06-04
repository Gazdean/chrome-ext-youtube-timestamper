import { Form } from 'react-bootstrap';

interface AutoPauseButtonProps {
    isAutoPauseEnabled: boolean;
    setIsAutoPauseEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AutoPauseButton({isAutoPauseEnabled, setIsAutoPauseEnabled}: AutoPauseButtonProps){
    
    return (
        <div className="ps-3 mb-3 d-flex justify-content-center">
            <Form.Switch
                label="Auto Pause"
                checked={isAutoPauseEnabled}
                onChange={() => setIsAutoPauseEnabled(curr => !curr)}
            />
        </div>
    );
}
