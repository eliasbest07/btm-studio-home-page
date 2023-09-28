
import RectangleComponent from '../components/rectangulo'

const ScrollComponent = () => {

    return (
        <div style={{
            height: '100%',
            background: 'url(segundobg.png) center / cover no-repeat, #6E727C',
            position: 'absolute',
            top:'40%',
            bottom: 0,
            width: '90%',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            boxShadow: '0px 2px 4px 2px rgba(0, 0, 0, 0.51)'
        }}>
          <RectangleComponent left={20} width={60} height={40}/>
          <RectangleComponent left={40} width={60} height={40}/>
          <RectangleComponent left={60} width={60} height={40}/>
          <RectangleComponent left={20} width={60} height={40}/>
          <RectangleComponent left={40} width={60} height={40}/>
        </div>
    );
};

export default ScrollComponent;

