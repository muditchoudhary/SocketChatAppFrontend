import { Skeleton, Box } from "@chakra-ui/react";
function ConversationSkeleton() {
  return (
    <>
      <Box display="flex" flexDirection="column"></Box>

      <SendMessageSkeleton />
      <SendMessageSkeleton />
      <SendMessageSkeleton />
    </>
  );
}

function SendMessageSkeleton() {
  return <Skeleton height="20px" />;
}

function ReceiveMessageSkeleton() {
  return <Skeleton height="20px" />;
}
