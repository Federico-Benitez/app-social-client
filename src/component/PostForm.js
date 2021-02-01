import React from "react";
import { Button, Container, Form, Segment, Grid } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

import "./PostForm.css";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ""
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getAllPosts: [result.data.createPost, ...data.getAllPosts]
        }
      });
      values.body = "";
    },
    onError(err) {
      console.log(err);
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <Container>
              <Grid container columns={3} stackable>
                <Grid.Column width={3}></Grid.Column>
                <Grid.Column width={10}>
                  <Segment.Group>
                    <Segment>
                      <Form.Input
                        placeholder="Saluda a tus amigos!"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={
                          error && {
                            content: "Debe escribir algo en la publicación",
                            pointing: "below"
                          }
                        }
                        size="big"
                        style={{ height: "90px" }}
                        className="InputPublicacion"
                      />
                    </Segment>
                    <Segment>
                      <Container textAlign="right">
                        <Button type="submit" color="orange">
                          Publicar
                        </Button>
                      </Container>
                    </Segment>
                  </Segment.Group>
                </Grid.Column>
                <Grid.Column width={3}></Grid.Column>
              </Grid>
            </Container>
          </Form.Field>
        </Form>
      </div>
      {/* {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )} */}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      username
      body
      createdAt
      likes {
        id
        username
        createdAt
      }
      likesCount
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;

export default PostForm;
