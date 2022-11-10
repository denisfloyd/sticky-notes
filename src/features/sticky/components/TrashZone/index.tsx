import { useSticky } from '../../contexts/StickyContext';
import { Container } from './styles';

export const TrashZone: React.FC = () => {
  const { highlightTrashZone } = useSticky();

  return <Container id='trashZone' role='region' isHighlighted={highlightTrashZone || false} />;
};
