import { Button } from "react-bootstrap";

interface EditButtonProps {
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditButton({isEditing, setIsEditing}: EditButtonProps) {
  return (
    <Button
        className="mb-2"
        variant={isEditing ? "warning" : "outline-primary"}
        onClick={() => setIsEditing((prev) => !prev)}
    >
        {isEditing ? "Close Edit" : "Open Edit"}
    </Button>
  )
}
