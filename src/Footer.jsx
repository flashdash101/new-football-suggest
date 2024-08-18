

function Footer() {
    const currentDate = new Date();

    return (
        <footer>&copy; {currentDate.getFullYear()}</footer>
    );

}



export default Footer