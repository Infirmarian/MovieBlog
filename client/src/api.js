const APIURL = '/posts';
const getURL = '/get_post';
const throwError = async (resp) => {
    const unknownErr = { errorMessage: 'Unknown error' };
    try {
        const body = await resp.json();
        if (body.message !== undefined) {
            let err = { errorMessage: body.message };
            throw err;
        } else {
            throw unknownErr;
        }
    } catch (e) {
        throw unknownErr;
    }
};

// TODO: Write a function that gets all of the posts from the database using a fetch
const getPosts = async () => {
    const resp = await fetch(getURL, {
        method: 'get',
        title: JSON.stringify(title)
    })
    if(!resp.ok) {
        throwError(resp);
    }
}
// TODO: Write a function that adds a new post to the database using a fetch
const addPost = async (post) => {
    const resp = await fetch(APIURL, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json'
            }),
        body: JSON.stringify(post)
        });
    if(!resp.ok) {
        throwError(resp);
    }
};
// TODO: Write a function that deletes a post from the database using a fetch
const deletePost = async (post) => {
    const resp = await fetch(APIURL, {
        method: 'delete'
    })
    .then(response => response.json());
    if(!resp.ok) {
        throwError(resp);
    }
};

export {
    //getPosts,
    addPost,
    // deletePost
};
