import { Skeleton, Box } from "@chakra-ui/react";
function ConversationSkeleton() {
  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <SendMessageSkeleton />
        <ReceiveMessageSkeleton />
        <SendMessageSkeleton />
        <ReceiveMessageSkeleton />
        <SendMessageSkeleton />
        <ReceiveMessageSkeleton />
      </Box>
    </>
  );
}

function SendMessageSkeleton() {
  return (
    <Skeleton
      height="18%"
      marginY="15px"
      width="45%"
      rounded="35px 15px 15px 15px"
    />
  );
}

function ReceiveMessageSkeleton() {
  return (
    <Skeleton
      height="18%"
      marginY="15px"
      width="45%"
      marginLeft={"auto"}
      rounded="15px 15px 35px 15px"
    />
  );
}

export default ConversationSkeleton;
