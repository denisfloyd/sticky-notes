import { useSticky } from "../../contexts/StickyContext"
import { Container } from "./styles"

export const AddStickButton: React.FC = () => {
  const {addSticky} = useSticky();

  return (
    <Container onClick={addSticky}>
      +
    </Container>
  )
}