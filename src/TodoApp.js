import React, { useEffect, useState } from "react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const apiUrl = "http://localhost:7000/api/todo";

  console.log(todos);

  const handleAddItem = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      setTitle("");
      setDescription("");
      setError("");
      fetch(`${apiUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            // setTodos([...todos, { title, description }]);
            setMessage("Item created successfully.");
            getItems();
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create an item.");
          }
        })
        .catch(() => {
          setError("Unable to create an item.");
        });
    } else {
      setError("Fields are empty");
    }
  };

  const handleEditTodo = (item) => {
    setIsEditing(true);
    setTitle(item?.title);
    setDescription(item?.description);
    setCurrentTodo(item);
  };

  const handleUpdateItem = () => {
    if (currentTodo && title.trim() !== "" && description.trim() !== "") {
      setTitle("");
      setDescription("");
      setError("");
      setIsEditing(false);
      fetch(`${apiUrl}/edit/${currentTodo?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      }).then((res) => {
        if (res.ok) {
          getItems();
          setMessage("Item edited successfully.");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      });
    } else {
      setError("Fields are empty");
    }
  };

  const handleDeleteTodo = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(`${apiUrl}/delete/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            const updatedList = todos.filter((item) => item?._id !== id);
            setTodos(updatedList);
            setMessage("Item deleted successfully.");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to delete item.");
          }
        })
        .catch(() => {
          setError("Unable to delete item.");
        });
    }
  };

  const getItems = () => {
    fetch(`${apiUrl}/get`)
      .then((res) => res.json())
      .then((res) => setTodos(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded mb-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isEditing ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleUpdateItem}
          >
            Update Item
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        )}
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
      <ul>
        {todos.length > 0 && todos?.map((todo) => (
          <li
            key={todo?._id}
            className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center"
          >
            <div className="w-[60%] md:w-auto">
              <h3 className="font-bold">{todo?.title}</h3>
              <p>{todo?.description}</p>
            </div>
            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleEditTodo(todo)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteTodo(todo?._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
