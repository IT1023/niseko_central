import { useEffect, useRef, useState, type RefObject } from "react";

interface UseIntersectionObserverProps {
  threshold: number;
}

interface UseIntersectionObserverReturn<T extends HTMLElement> {
  isVisible: boolean;
  componentRef: RefObject<T | null>;
}

export default function useIntersectionObserver<T extends HTMLElement>({
  threshold,
}: UseIntersectionObserverProps): UseIntersectionObserverReturn<T> {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const componentRef = useRef<T | null>(null);

  useEffect(() => {
    const currentRef = componentRef.current;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold,
        rootMargin: "50px 0px",
      },
    );

    if (currentRef) {
      intersectionObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        intersectionObserver.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { isVisible, componentRef };
}
