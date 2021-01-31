import React from "react";
import { Button, Container, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

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
      <Form onSubmit={onSubmit}>
        <Container textAlign="justified" style={{ marginBottom: 20 }}>
          <h2>Crea una nueva publicacion</h2>
        </Container>

        <Form.Field>
          <Form.Input
            placeholder="Saluda a tus amigos!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Container textAlign="right">
            <Button type="submit" color="orange">
              Publicar
            </Button>
          </Container>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
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
