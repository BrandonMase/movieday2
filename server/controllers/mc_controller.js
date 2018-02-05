let listName = "";
let movieList = [];

module.exports = {
    read: (req, res) => {
        res.status(200).send(movieList)
    },    
    create: (req, res) => {
        let { title, id,runtime } = req.body
        movieList.push({ title, id,runtime });
        res.status(200).send(movieList)
    },
    remove: (req, res) => {
        let deleteID = req.params.id;
        let index = movieList.findIndex(e => e.id == deleteID);
        movieList.splice(index, 1);

        res.status(200).send(movieList)
    },
    updateListName:(req, res) => {
        listName = req.params.id;
        res.status(200).send(listName);
    },
    getListName: (req, res) => {
        res.status(200).send(listName);
    }

}