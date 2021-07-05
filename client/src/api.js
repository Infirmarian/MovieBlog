const addURL = '/create_post';
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
const getPosts = async (auth) => {
    const resp = await fetch(getURL,
        {
            method: 'get',
            headers: new Headers({
                "Content-Type":"application/json"
            }),
            body: JSON.stringify(auth)
        });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp;
    }
};

// TODO: Write a function that adds a new post to the database using a fetch
const addPost = async (post) => {
    console.log(post);
    const resp = await fetch(addURL, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json'
            }),
        body: JSON.stringify(post)
        });
    if(!resp.ok) {
        throwError(resp);
    }
    console.log(resp.body);
    return resp;
};
// TODO: Write a function that deletes a post from the database using a fetch
const deletePost = async (postId) => {
    const delURL = getURL + '/' + postId;
    const resp = await fetch(delURL, {
        method: 'delete'
    });

    if (!resp.ok) {
        throwError(resp);
    } 
};

export {
    getPosts,
    addPost,
    deletePost
};
