import React, { useEffect, useState } from 'react';
// import {
// 	Box,
// 	Flex,
// 	IconButton,
// 	Stack,
// 	StackDivider,
// 	StackProps,
// 	Tooltip,
// 	useColorMode,
// 	useColorModeValue,
// 	useToast,
// 	VisuallyHidden,
// } from "@chakra-ui/react";
import { EmotionIcon } from '@emotion-icons/emotion-icon';
import { ActionIcon, Box, Flex, Group, Stack, Text, Tooltip } from '@mantine/core';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { useDropzone } from 'react-dropzone';
// import MarkdownHelpText from "../MarkdownHelpText";
import { getTipTapExtensions } from '../../../components/Portfolio/extensions';
import {
  IconFormatBold,
  IconFormatClear,
  IconFormatCodeBlock,
  IconFormatCodeInline,
  IconFormatDivider,
  IconFormatHeading,
  IconFormatImage,
  IconFormatItalic,
  IconFormatLink,
  IconFormatLinkRemove,
  IconFormatListBulleted,
  IconFormatListNumbered,
  IconFormatQuote,
  IconFormatSpoiler,
  IconFormatStrikethrough,
  IconFormatUnderline,
  IconFormatWrapText,
  IconPen,
  IconRedo,
  IconUndo,
} from '../../../components/Portfolio/icons/Icons';

// import theme from "../../theme";

/**
 * Rich editor based on tiptap v2
 * Ported from gh:joincomet
 * @see https://github.com/joincomet/comet/blob/main/web/src/components/ui/editor/Editor.jsx
 */

interface RichTextEditorProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  charLimit?: number;
  withImage?: boolean;
  placeholder?: string;
}

interface MenuBarProps {
  editor: Editor | null;
}

interface FormatButtonProps {
  label: string;
  icon: EmotionIcon;
  isSmall?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | ((t: File) => void);
  isActive?: boolean;
  type?: string;
}

function FormatButton({
  label,
  type,
  icon,
  isSmall = false,
  onClick,
  isActive,
}: FormatButtonProps) {
  // const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const color = useColorModeValue("gray.900", "whiteAlpha.900");
  // const bgColor = useColorModeValue("whiteAlpha.900", "gray.900");

  const Icon = icon;

  const onDropImage = async (files: File[]) => {
    const [image] = files;

    try {
      setIsSubmitting(true);

      if (image) {
        console.log({ image });
        if (image.size >= 5000000) {
          throw new Error('Size of the image must be below 5MB.');
        } else {
          (onClick as unknown as (t: File) => void)?.(image);
        }
      }

      setIsSubmitting(false);
    } catch (error: any) {
      alert(error.message);
      // toast({
      // 	title: "Avatar size limit error",
      // 	description: error.message,
      // 	status: "error",
      // 	isClosable: true,
      // });
      setIsSubmitting(false);
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp', '.gif'],
    },
    // accept: ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"],
    disabled: isSubmitting,
    onDrop: onDropImage,
  });

  if (type === 'image') {
    return (
      <Tooltip
        label={label}
        aria-label={label}
        withArrow
        transitionProps={{ duration: 200 }}
      >
        <ActionIcon
          radius="sm"
          mr={1}
          variant="outline"
          p={1}
          aria-label={label}
          h={9}
          color={isActive ? 'blue.3' : 'gray.3'}
        >
          <Icon />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      label={label}
      aria-label={label}
      withArrow
      transitionProps={{ duration: 200 }}
    >
      <ActionIcon
        radius="sm"
        mr={1}
        variant="outline"
        p={1}
        aria-label={label}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
        h={9}
        color={isActive ? 'blue.3' : 'gray.3'}
      >
        <Icon />
      </ActionIcon>
    </Tooltip>
    /* <IconButton
				rounded="sm"
				mr={1}
				bg={isActive ? color : "transparent"}
				border="none"
				p={1}
				aria-label={label}
				boxSize={7}
				h={9}
				color={isActive ? bgColor : color}
				_hover={{
					bg: color,
					color: bgColor,
				}}
				_focus={{ outline: "none" }}
				onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
				transition="var(--transition)"
				icon={<Box as={Icon} boxSize={isSmall ? 4 : 5} mt={isSmall ? "0.5" : undefined} />}
			>
				<VisuallyHidden>{label}</VisuallyHidden>
				<Box as={Icon} boxSize={isSmall ? 4 : 5} mt={isSmall ? "0.5" : undefined} />
			</IconButton>
		</Tooltip> */
  );
}

function FormatGroup({ children }: any) {
  return (
    <Flex gap="0.5" px={2} h="full" align="center">
      {children}
    </Flex>
  );
}

const TipTapImageTest = ({
  text,
  charLimit,
  setText,
  withImage,
  placeholder,
}: RichTextEditorProps) => {
  // const { colorMode } = useColorMode();
  // const isDark = colorMode === "dark";
  const [image, setImage] = useState<File | undefined>();
  // const borderColor = isDark ? theme.colors.whiteAlpha[900] : theme.colors.gray[900];

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise(function (resolve, reject) {
      let fr = new FileReader();

      fr.onload = function () {
        resolve(fr.result as string);
      };

      fr.onerror = function () {
        reject(fr);
      };

      fr.readAsDataURL(file);
    });
  }

  const handleUpload = async (file: File) => {
    const result = await readFileAsDataURL(file);

    return result;
  };

  const extensions = getTipTapExtensions({
    withImage,
    handleUpload,
    limit: charLimit,
    placeholder,
  });

  useEffect(() => {
    async function handleImageUpload() {
      if (image && editor) {
        const src = await handleUpload(image);
        console.log({ src });
        editor.chain().focus()?.setImage({ src })?.run();
      }
    }
    handleImageUpload();
  }, [image]);

  const editor = useEditor({
    extensions,
    content: text,
    editorProps: {
      attributes: {
        spellcheck: 'true',
      },
    },
  });

  const html = editor?.getHTML() ?? '';
  // const charCountColor = useColorModeValue("gray.500", "whiteAlpha.900");

  function countCharacters() {
    let characters = editor?.getCharacterCount().toString();

    if (charLimit) characters += ` / ${charLimit}`;

    return `${characters} characters`;
  }

  useEffect(() => {
    if (html === `<p></p>`) setText('');
    else setText(html);
  }, [html, setText, editor]);

  function MenuBar({ editor }: MenuBarProps) {
    if (!editor) return null;

    return (
      <Flex
        wrap="wrap"
        direction="row"
        // borderBottom={`3px solid ${borderColor}`}
        // divider={<StackDivider bg={`rgba(${borderColor}, 0.1)`} w={0.5} ml={2} mr={3} h={5} />}
      >
        <FormatGroup>
          <FormatButton
            label="Bold (Ctrl+B)"
            icon={IconFormatBold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
          <FormatButton
            label="Italic (Ctrl+U)"
            icon={IconFormatItalic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
          <FormatButton
            label="Underline (Ctrl+I)"
            icon={IconFormatUnderline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          />
          <FormatButton
            label="Strikethrough"
            icon={IconFormatStrikethrough}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          />

          <FormatButton
            label="Highlight"
            icon={IconPen}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
          />
        </FormatGroup>
        <FormatGroup>
          {/* <FormatButton
						label="Spoiler"
						icon={IconFormatSpoiler}
						onClick={() => editor.chain().focus().toggleSpoiler().run()}
						isActive={editor.isActive("spoiler")}
					/> */}
          <FormatButton
            label="Inline Code"
            icon={IconFormatCodeInline}
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          />
        </FormatGroup>
        <FormatGroup>
          <FormatButton
            label="Link"
            icon={IconFormatLink}
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              const href = window.prompt('URL') as string;
              editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
            }}
            isActive={editor.isActive('link')}
          />

          {editor.isActive('link') && (
            <FormatButton
              label="Remove Link"
              icon={IconFormatLinkRemove}
              onClick={() => editor.chain().focus().unsetLink().run()}
            />
          )}

          <FormatButton
            label="Divider"
            icon={IconFormatDivider}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </FormatGroup>
        <FormatGroup>
          <FormatButton
            label="Bulleted List"
            icon={IconFormatListBulleted}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          />
          <FormatButton
            label="Numbered List"
            icon={IconFormatListNumbered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          />
        </FormatGroup>
        <FormatGroup>
          <FormatButton
            label="Large Heading (Ctrl+[)"
            icon={IconFormatHeading}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          />
          <FormatButton
            label="Small Heading (Ctrl+])"
            icon={IconFormatHeading}
            isSmall
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
          />
        </FormatGroup>
        <FormatGroup>
          <FormatButton
            label="Block Quote"
            icon={IconFormatQuote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          />
          <FormatButton
            label="Code Block"
            icon={IconFormatCodeBlock}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          />
        </FormatGroup>
        <FormatGroup>
          <FormatButton
            label="Hard Break"
            icon={IconFormatWrapText}
            onClick={() => editor.chain().focus().setHardBreak().run()}
          />
          <FormatButton
            label="Clear Format"
            icon={IconFormatClear}
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          />
        </FormatGroup>
        <FormatGroup>
          {withImage && (
            <FormatButton
              type="image"
              label="Add an image"
              icon={IconFormatImage}
              onClick={(event: File) => setImage(event)}
            />
          )}
        </FormatGroup>
        <FormatGroup>
          <FormatButton
            onClick={() => editor.chain().undo().run()}
            label="Undo"
            icon={IconUndo}
          />
          <FormatButton
            label="Redo"
            icon={IconRedo}
            onClick={() => editor.chain().redo().run()}
          />
        </FormatGroup>
      </Flex>
    );
  }
  // border={`3px solid ${borderColor}`}
  return (
    <Flex
      direction="column"
      // maxH="md"
      // rounded="xl"
    >
      <MenuBar editor={editor} />
      <Box
        sx={(theme) => ({
          display: 'flex',
          padding: '1.25rem 1rem',
          flex: '1 1 auto',
          overflowX: 'hidden',
          overflowY: 'auto',
        })}
      >
        <EditorContent editor={editor} />
      </Box>
      <Flex
        // fontSize="sm"
        // flex="0 0 auto"
        // borderTop={`3px solid ${borderColor}`}

        wrap="wrap"
        p="0.25rem 0.75rem"
        align="center"
        justify="space-between"
      >
        {/* <MarkdownHelpText /> */}
        <Text fw={600} color="gray.400" mt={4} id="character-count">
          {countCharacters()}
        </Text>
      </Flex>
    </Flex>
  );
};

export default TipTapImageTest;
