const RectangleComponent = ({ color, height, width, left,children }) => {
    return (
        <div style={{
            height: `${height}px`,
            width: `${width}px`,
            background: `${color}`,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            borderRadius: '20px',
            marginLeft: `${left}px`,
            marginTop: `${left}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </div>
    );
};

export default RectangleComponent;

/* Rectangle 183 

box-sizing: border-box;

position: absolute;
width: 443px;
height: 246px;
left: 345px;
top: 28px;

background: rgba(41, 41, 38, 0.6);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05);
backdrop-filter: blur(6px);
/* Note: backdrop-filter has minimal browser support 
border-radius: 20px;
*/
