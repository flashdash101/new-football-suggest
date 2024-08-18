import Cat from './assets/cat.jpeg'
function Card() {
    return (
        <>
            <div className="card">
                <img alt="This is an image of a cat"
                    className='cardImage' src={Cat} />
                <h3 className="cardTitle">Card Title</h3>
                <p className="cardContent">Card content</p>
            </div>
        
        </>
    );
}





export default Card