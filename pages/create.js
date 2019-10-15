import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon,
} from 'semantic-ui-react';
import axios from 'axios';

import axiosBase from '../utils/axiosBase';
import catchErrors from '../utils/catchErrors';

const INITIAL_PRODUCT = {
  name: '',
  price: '',
  media: '',
  description: '',
};

function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  const handleChange = event => {
    const { name, value, files } = event.target;
    if (name === 'media') {
      setProduct(prevState => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      setError('');
      setLoading(true);
      const mediaUrl = await handleImageUpload();
      const { name, price, description } = product;
      const response = await axiosBase.post('/product', {
        name,
        price,
        description,
        mediaUrl,
      });
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async event => {
    const data = new FormData();
    data.append('file', product.media);
    data.append('upload_preset', 'reactreserve');
    data.append('cloud_name', 'dwjbjupgm');
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    return response.data.url;
  };

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message error header="Oops!" content={error} />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="price"
            type="number"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            value={product.price}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="media"
            type="file"
            label="Media"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <Form.Field
          control={Button}
          disabled={loading || disabled}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
