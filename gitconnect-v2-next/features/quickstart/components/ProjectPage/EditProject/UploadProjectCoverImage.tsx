import { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Group,
  Image,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { AuthContext } from "@/context/AuthContext";
import { useAtom } from "jotai";
import { unsavedChangesSettingsAtom } from "@/atoms";
import { useProjectCoverImageUpload } from "@/features/quickstart/hooks/useProjectCoverImageUpload";

type RepoProps = {
  repoId: string | number;
  existingCoverImage?: string;
  handleNewCoverImage: (url: string) => void;
};

export function UploadProjectCoverImage(
  { repoId, existingCoverImage, handleNewCoverImage }: RepoProps,
  props: Partial<DropzoneProps>,
) {
  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const theme = useMantineTheme();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [imgCheck, setImgCheck] = useState(false);
  const [unsavedChangesSettings, setUnsavedChangesSettings] = useAtom(unsavedChangesSettingsAtom);

  // Use the custom hook for upload logic
  const {
    uploadCoverImage,
    progress,
    isUploading,
    error,
    imgUrl,
  } = useProjectCoverImageUpload({ userId, repoId });

  // Preview for dropped file
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  const handleFileCancel = () => {
    setFiles([]);
    setImgCheck(false);
    setUnsavedChangesSettings(false);
  };

  const handleFileDrop = (file: FileWithPath[]) => {
    setFiles(file);
    setImgCheck(true);
    setUnsavedChangesSettings(true);
  };

  // When upload is successful, call handleNewCoverImage
  useEffect(() => {
    if (imgUrl) {
      handleNewCoverImage(imgUrl);
      setUnsavedChangesSettings(false);
      setImgCheck(false);
      setFiles([]);
    }
  }, [imgUrl]);

  return (
    <>
      <Dropzone
        onDrop={handleFileDrop}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={6 * 1024 ** 2}
        maxFiles={1}
        mb="lg"
        accept={IMAGE_MIME_TYPE}
        sx={(theme) => ({
          maxWidth: 200,
          maxHeight: 180,
          textAlign: "center",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          marginTop: 30,
          backgroundColor: "#afafaf1a",
        })}
        {...props}
      >
        <Group position="center">
          <Dropzone.Accept>
            <IconUpload
              size={50}
              stroke={1.5}
              color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size={50}
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            {existingCoverImage && !imgUrl ? (
              <Image
                mb="xs"
                height={100}
                src={existingCoverImage}
                alt="Current cover image"
              />
            ) : imgUrl ? (
              <Image
                mb="xs"
                height={100}
                src={imgUrl}
                alt="Current cover image"
              />
            ) : (
              <IconPhoto size={40} stroke={1.5} />
            )}
            <Text size="md">Edit cover image</Text>
            <Text size="xs"> Max 6MB</Text>
          </Dropzone.Idle>
        </Group>
      </Dropzone>

      {imgCheck && !imgUrl && (
        <>
          <Group position="center">
            <Space h="lg" />
            <Text>Preview:</Text>
            <Space h="sm" />
            <Container size={200}>{previews}</Container>
          </Group>
          <Group mt="lg" position="center" spacing="xs">
            <Button
              component="a"
              size="xs"
              radius="md"
              onClick={async () => {
                if (files[0]) {
                  await uploadCoverImage(files[0]);
                }
              }}
              loading={isUploading}
              disabled={isUploading}
              styles={(theme) => ({
                root: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.green[8]
                      : theme.colors.green[6],
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.green[9]
                        : theme.colors.green[9],
                  },
                },
              })}
            >
              {isUploading ? `Uploading...` : "Save Image"}
            </Button>
            <Button
              component="a"
              size="xs"
              radius="md"
              variant="outline"
              color="red"
              onClick={handleFileCancel}
              disabled={isUploading}
            >
              Remove
            </Button>
          </Group>
        </>
      )}
    </>
  );
}

export default UploadProjectCoverImage;
