import { useSelector, useDispatch } from 'react-redux'
import { Drawer, List } from "@mui/material"
import assets from '../../assets/index';

const Sidebar = () => {
  const user = useSelector((state) => state.user.value)

  const sidebarWidth = 250

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{
        width: sidebarWidth,
        height: '100%',
        '& > div': { borderRight: 'none' }
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: assets.colors.secondary
        }}
      >

      </List>
    </Drawer>
  )
}

export default Sidebar