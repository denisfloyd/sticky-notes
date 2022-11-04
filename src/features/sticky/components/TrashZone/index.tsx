import { useSticky } from '../../contexts/StickyContext';
import { Container } from './styles';

export const TrashZone: React.FC = () => {
  const { highlightTrashZone } = useSticky();

  return <Container id='trashZone' isHighlighted={highlightTrashZone || false} />;
};
