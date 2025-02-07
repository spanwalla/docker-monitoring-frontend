import {Layout} from 'antd'
import 'antd/dist/reset.css'
import PingerTable from "./components/PingerTable.tsx";

const {Header, Content} = Layout;

function App() {
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{backgroundColor: '#1d63ed'}}>
                <h1 style={{color: '#E5F2FC'}}>Pinger</h1>
            </Header>
            <Content style={{padding: '24px'}}>
                <PingerTable/>
            </Content>
        </Layout>
    )
}

export default App;
