// app/index.tsx

import { ChatHeader } from "@/components/ChatHeader";
import ChatApp from "../chat/[id]";

export default function Index() {
  return (
    <>
      <ChatHeader leftIcon="back" />
      <ChatApp />
    </>
  )
}