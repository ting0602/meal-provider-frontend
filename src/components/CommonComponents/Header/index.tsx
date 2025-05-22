import { useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './Header.css';

type HeaderProps = {
  onSelectFactory?: (factory: string, index: number) => void;
};

const Header = ({ onSelectFactory }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const factories = ['台積電1廠', '台積電2廠', '台積電3廠', '台積電4廠', '台積電5廠'];
  const [selectedFactory, setSelectedFactory] = useState(factories[0]);

  const handleToggle = () => setOpen(!open);

  const handleSelect = (factory: string, index: number) => {
    setSelectedFactory(factory);
    setOpen(false);
    onSelectFactory?.(factory, index); // 通知父層
  };

  return (
    <div id="header">
      <List className="factory-list">
        <div className="header-content">
          <ListItemButton onClick={handleToggle} className={open ? 'list-header expanded' : 'list-header'}>
            {open ? <ExpandLessIcon className='header-icon' /> : <ExpandMoreIcon className='header-icon' />}
            <ListItemText primary={<span className="header-text">{selectedFactory}</span>} />
          </ListItemButton>

          <Collapse in={open} timeout="auto" unmountOnExit className='collapse-list'>
            {factories.map((item, index) => (
              <ListItemButton key={index} className="list-item" onClick={() => handleSelect(item, index)}>
                <ListItemText primary={<span className="item-text">{item}</span>} />
              </ListItemButton>
            ))}
          </Collapse>
        </div>
      </List>
    </div>
  );
};

export default Header;
