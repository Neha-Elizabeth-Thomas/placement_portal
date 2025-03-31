import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaRobot, FaUser, FaTimes } from "react-icons/fa";

const ChatBot = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!query.trim() || !token) return;

        const userMessage = { sender: "user", text: query };
        setChatHistory((prev) => [...prev, userMessage]);
        setQuery("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_UR}/portal/chat`,
                {
                    contents: [
                        {
                            parts: [{ text: query }],
                        },
                    ],
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const botReply =
                response.data?.response?.parts?.[0]?.text ||
                "Sorry, I couldn't understand.";
            const botMessage = { sender: "bot", text: botReply };

            setChatHistory((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setChatHistory((prev) => [
                ...prev,
                { sender: "bot", text: "Error fetching response. Try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[750px] w-[500px] bg-white rounded-lg  overflow-hidden border-[#3e0c53] border-5">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-[#3e0c53]">
                <div className="flex items-center justify-center">
                    <FaRobot className="mr-3 text-3xl text-white" />
                    <h1 className="text-lg font-semibold text-white">Lost in Placements? Don’t Worry, I’m Your Rescue Bot!</h1>
                </div>
                <button onClick={onClose} className="hover:bg-blue-500 p-2 rounded-full text-white">
                    <FaTimes />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                <p className="text-center text-[#4B0082] p-3 bg-navy">
    🤖 Hey there, future CEO! 🚀 Ask me about placement drives, guidelines, qualifications, or how to crack interviews like a pro! 😆🎓💼  
</p>

                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                        <div
                            className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                                msg.sender === "user"
                                    ? "bg-[#4B0082] text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                {msg.sender === "user" ? (
                                    <FaUser className="mr-2 text-lg" />
                                ) : (
                                    <FaRobot className="mr-2 text-lg" />
                                )}
                                <span className="text-sm font-semibold">
                                    {msg.sender === "user" ? "You" : "Bot"}
                                </span>
                            </div>
                            <p className="text-xl whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start mb-4">
                        <div className="max-w-[75%] p-3 bg-gray-200 text-gray-800 rounded-lg shadow-md">
                            <p className="text-sm">Typing...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex p-4 border-t  bg-white">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What You Want To Know :)..."
                    className="flex-1 p-2  border-[#9400D3] rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="p-3 bg-[#9400D3] text-white rounded-r-xl hover:bg-blue-600 disabled:bg-gray-400"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
