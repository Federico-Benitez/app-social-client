import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Container, Grid } from "semantic-ui-react";

import PostCard from "../component/PostCard";
import PostForm from "../component/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";

import "./Home.css";

function Home() {
  const { user } = useContext(AuthContext);

  const { loading, data: { getAllPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  return (
    <Grid columns={1} stackable>
      <Grid.Row>
        <Container textAlign="center">
          <h1>
            {/* <p>Hola {user ? user.username : null}</p> */}
            Publicaciones Recientes
          </h1>
        </Container>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
        </Grid.Column>

        {loading ? (
          <h1> Cargando...</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id}>
              <div className="Publicaciones">
                <PostCard post={post} />
              </div>
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
