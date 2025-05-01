import { ref } from 'vue';
import axios from 'axios';

interface Suggestion {
  author: string;
  productName: string;
  description: string;
}

export function useSuggestions() {
  const showSuggestionForm = ref(false);
  const isLoading = ref(false);
  const isSubmitted = ref(false); 
  const suggestion = ref({
    author: '',
    productName: '',
    description: ''
  });

  const isValid = () => {
    return suggestion.value.author.trim() && 
           suggestion.value.productName.trim() && 
           suggestion.value.description.trim();
  };

  const resetForm = () => {
    suggestion.value = { author: '', productName: '', description: '' };
    isSubmitted.value = false;
  };

  const submitSuggestion = async () => {
    if (!isValid()) return;
    
    isLoading.value = true;
    try {
      await axios.post('https://17b8e0fa574c3024.mokky.dev/suggestions', {
        author: suggestion.value.author,
        product_name: suggestion.value.productName,
        description: suggestion.value.description,
        date: new Date().toISOString()
      });
      isSubmitted.value = true;
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка при отправке. Попробуйте позже.');
    } finally {
      isLoading.value = false;
    }
  };

  return {
    showSuggestionForm,
    isLoading,
    isSubmitted,
    suggestion,
    isValid,
    submitSuggestion,
    resetForm
  };
}