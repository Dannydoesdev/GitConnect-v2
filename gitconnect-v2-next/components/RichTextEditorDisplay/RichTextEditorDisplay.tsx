import {
  Button,
  Card,
  Center,
  Container,
  Stack,
} from '@mantine/core';
import useStyles from './RichTextEditorDisplay.styles'

type TipTapDisplayProps = {
  content: string
}

function RichTextEditorDisplay({ content }: TipTapDisplayProps) {

  const { classes, theme } = useStyles();

  return (
    <Container
      id='second-section'
      py="xl"
      className={classes.container}
    >

      <Card
        shadow="md"
        radius="md"
        p="xl"
        className={classes.card}
        
        >
          {/* dangerouslySetInnerHTML={{ __html: content }} */}
      <div dangerouslySetInnerHTML={{ __html: content }} />

      </Card>
    </Container>

  )

}


export default RichTextEditorDisplay;